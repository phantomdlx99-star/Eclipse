"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Position,
  Panel,
  Background,
  Controls,
  Handle,
  type Node,
  type Edge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { generateMindMap } from "@/lib/actions/featuresActions";
import { Button } from "./ui/button";
import {
  Loader2,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  ChevronRight,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import Remarked from "@/components/Remarked";

// --- Types ---

interface MindMapNodeData {
  label: string;
  children: MindMapNodeData[];
}

interface MindMapData {
  root: MindMapNodeData;
}

// --- Dagre Layout Engine ---

const fitViewOptions = {
  padding: 0.2,
  animate: true,
  duration: 500,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 80;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB",
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

// --- Custom Node Components ---

const CustomNode = ({ data }: any) => {
  const { setNodes, setEdges } = useReactFlow();
  const hasChildren = data.children?.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onToggle();
    // Optional: Fit view logic could go here if we had access to the instance easily,
    // but the parent component handles layout updates.
  };

  return (
    <div
      className={`
        px-6 py-4 rounded-3xl border transition-all duration-300 flex items-center gap-4 min-w-[200px] max-w-[400px]
        ${
          data.isRoot
            ? "bg-linear-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)] backdrop-blur-xl"
            : "bg-neutral-900/90 border-neutral-700/50 hover:border-neutral-500 hover:bg-neutral-800/90 shadow-lg backdrop-blur-md"
        }
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="bg-neutral-600! w-2! h-2! opacity-0"
      />

      <div className="flex-1 min-w-0">
        <Remarked text={data.label} />
      </div>

      {hasChildren && (
        <button
          onClick={handleToggle}
          className={`
            p-1.5 rounded-full transition-all duration-200 
            ${data.isRoot ? "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200"}
          `}
        >
          {data.isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-neutral-600! w-2! h-2! opacity-0"
      />
    </div>
  );
};

const nodeTypes = {
  mindmap: CustomNode,
};

// --- Main Component ---

const MindMap = ({
  classId,
  subjectId,
  chapterId,
  topic: initialTopic,
}: {
  classId: string;
  subjectId: string;
  chapterId: string;
  topic?: string;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [rawMindMap, setRawMindMap] = useState<MindMapData | null>(null);

  const { fitView } = useReactFlow();

  // Helper to flatten recursive structure into RF elements
  const flattenMindMap = useCallback(
    (
      node: MindMapNodeData,
      parentId: string | null = null,
      depth = 0,
      expandedIds: Set<string>,
    ) => {
      const nodeId = parentId ? `${parentId}-${node.label}` : "root";
      const currentNodes: Node[] = [];
      const currentEdges: Edge[] = [];

      const isExpanded = expandedIds.has(nodeId);

      currentNodes.push({
        id: nodeId,
        type: "mindmap",
        data: {
          label: node.label,
          isRoot: depth === 0,
          isExpanded: isExpanded,
          children: node.children,
          onToggle: () => toggleNode(nodeId),
        },
        position: { x: 0, y: 0 }, // Positioned by Dagre
      });

      if (parentId) {
        currentEdges.push({
          id: `e-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: ConnectionLineType.SmoothStep,
          animated: true,
          style: {
            stroke: "#525252", // neutral-600
            strokeWidth: 2,
            opacity: 0.5,
          },
        });
      }

      if (isExpanded && node.children) {
        node.children.forEach((child) => {
          const { nodes: childNodes, edges: childEdges } = flattenMindMap(
            child,
            nodeId,
            depth + 1,
            expandedIds,
          );
          currentNodes.push(...childNodes);
          currentEdges.push(...childEdges);
        });
      }

      return { nodes: currentNodes, edges: currentEdges };
    },
    [],
  );

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["root"]),
  );

  const toggleNode = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });

      // Request a frame for the layout to finish, then animate view
      requestAnimationFrame(() => {
        fitView(fitViewOptions);
      });
    },
    [fitView],
  );

  // Update RF elements whenever raw data or expansion state changes
  useMemo(() => {
    if (!rawMindMap) return;
    const { nodes: flatNodes, edges: flatEdges } = flattenMindMap(
      rawMindMap.root,
      null,
      0,
      expandedIds,
    );
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      flatNodes,
      flatEdges,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [rawMindMap, expandedIds, flattenMindMap, setNodes, setEdges]);

  const fetchMindMap = useCallback(async () => {
    setLoading(true);
    setHasGenerated(true);
    try {
      const topic = initialTopic || `Chapter ${chapterId}`;
      const result = await generateMindMap(
        chapterId,
        classId,
        subjectId,
        topic,
      );
      if (result && !result.error) {
        setRawMindMap(result);
        setExpandedIds(new Set(["root"])); // Reset expansion
      } else {
        toast.error(result?.error || "Failed to generate Mind Map");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate mind map");
    } finally {
      setLoading(false);
    }
  }, [classId, subjectId, chapterId, initialTopic]);

  if (!hasGenerated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 bg-gray-950/50 rounded-3xl border border-primary/20 backdrop-blur-sm">
        <Button
          onClick={fetchMindMap}
          size="lg"
          className="rounded-full px-10 py-8 text-xl font-medium gap-3 bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
        >
          <Brain className="w-6 h-6" />
          Generate MindMap
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 bg-black/50 rounded-3xl border border-neutral-800 backdrop-blur-sm">
        <Loader2 className="w-12 h-12 animate-spin text-white/50" />
        <p className="text-xl text-neutral-400 font-medium animate-pulse">
          Generating connections...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] bg-black rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={fitViewOptions}
        minZoom={0.1}
        maxZoom={4}
        className="bg-neutral-950"
        defaultEdgeOptions={{
          type: ConnectionLineType.SmoothStep,
          animated: true,
        }}
      >
        <Background color="#222" gap={24} size={1} />
        <Controls className="bg-neutral-900 border-neutral-800 text-neutral-400 fill-neutral-400" />
        <Panel position="top-right" className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMindMap}
            className="gap-2 border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all rounded-full h-10 px-4"
          >
            <RefreshCw size={14} />
            <span className="hidden md:inline">Regenerate</span>
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const MindMapWrapper = (props: any) => (
  <ReactFlowProvider>
    <MindMap {...props} />
  </ReactFlowProvider>
);

export default MindMapWrapper;
