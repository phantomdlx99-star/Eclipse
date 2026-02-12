"use client";
import { generateTimeTable } from "@/lib/actions/timeTableAction";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";
const PersonalizedLearning = ({
  classId,
  subjectId,
  chapterId,
  topic,
}: {
  classId: string;
  subjectId: string;
  chapterId: string;
  topic: string | undefined;
}) => {
  const [time, setTime] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const generatePaths = async () => {
    setLoading(true);
    try {
      const result = await generateTimeTable(
        `Generate a timetable for a student who wants to prepare for the JEE exam in 6 months. The student has 6 hours of study time per day and wants to cover the course. The timetable should be for 6 days a week with one day for revision. The student is in ${classId}`,
      );

      if (result && result.timetable) {
        const dayOrder: { [key: string]: number } = {
          monday: 0,
          mon: 0,
          tuesday: 1,
          tue: 1,
          wednesday: 2,
          wed: 2,
          thursday: 3,
          thu: 3,
          friday: 4,
          fri: 4,
          saturday: 5,
          sat: 5,
          sunday: 6,
          sun: 6,
        };

        result.timetable.sort((a: any, b: any) => {
          const dayA = (a.day || "").toLowerCase().trim();
          const dayB = (b.day || "").toLowerCase().trim();
          return (dayOrder[dayA] ?? 99) - (dayOrder[dayB] ?? 99);
        });
      }

      setLoading(false);
      setTime(result);
      return toast.success("TimeTable generated successfully.", {
        position: "top-center",
      });
    } catch (error: any) {
      setLoading(false);
      return toast.error(`Failed to generate timetable: ${error}`, {
        position: "top-center",
      });
    }
  };

  console.log(time);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const [visible, setVisible] = useState(false);
  const handleVisibility = () => {
    window.scrollY > 100 ? setVisible(true) : setVisible(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleVisibility);
    return () => window.removeEventListener("scroll", handleVisibility);
  }, []);
  return (
    <main className="font-display">
      <div>
        <div
          className="w-full h-auto flex justify-center gap-5"
          ref={containerRef}
        >
          <Button
            onClick={handleScroll}
            className={
              visible ? "rounded-full fixed bottom-5 right-5" : "hidden"
            }
          >
            <ArrowUp size={30} />
          </Button>
          <Button
            onClick={generatePaths}
            disabled={time !== null}
            className="text-xl font-bold disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate TimeTable"}
          </Button>
          {time && (
            <Button
              onClick={() => window.location.reload()}
              className="text-xl font-bold "
            >
              Reset
            </Button>
          )}
        </div>
        {time && (
          <>
            <div className="w-full mt-10 h-auto px-4 py-3 grid grid-cols-1 gap-7 lg:grid-cols-2">
              {time?.timetable?.map((item: any, index: any) => (
                <Card
                  key={index}
                  className="w-full h-auto px-4 py-2 rounded-xl"
                >
                  <div className="w-full h-auto text-xl font-display text-center text-bold relative before:absolute before:content-[''] before:w-auto before:h-0.75 before:rounded-full before:bg-linear-to-r before:from-primary before:to-secondary before:left-4 before:-bottom-5 before:right-4">
                    {item.day}
                  </div>
                  <div className="w-full h-auto grid grid-cols-3 gap-y-4 py-4 items-start">
                    {/* Headers */}
                    <div className="text-white font-display font-semibold text-xl text-center border-r-2 border-border">
                      Time
                    </div>
                    <div className="text-white font-display font-semibold text-xl text-center border-r-2 border-border">
                      Subject
                    </div>
                    <div className="text-white font-display font-semibold text-xl text-center">
                      Topic
                    </div>

                    {/* Rows */}
                    {item.schedule.map((sch: any, idx: any) => (
                      <div key={idx} className="contents">
                        <div className="w-auto h-auto flex flex-col items-center text-center">
                          {sch.time}
                        </div>
                        <div className="w-auto h-auto flex flex-col items-center text-center font-medium">
                          {sch.subject}
                        </div>
                        <div className="w-auto h-auto flex flex-col items-start px-4">
                          <li className="text-start list-none before:absolute before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-linear-to-r before:from-primary before:to-secondary before:-left-4 before:top-3 before:-translate-y-1/2 relative wrap-break-word">
                            {sch.topic}
                          </li>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-xl font-semibold mt-7 mb-8">
              <h1 className="text-center fond-bold text-3xl text-transparent bg-linear-60 from-primary to-secondary bg-clip-text">
                Description of TimeTable
              </h1>
              <div className="px-5 py-2 mt-4 flex gap-5 items-start">
                <p className="text-justify">{time?.description}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default PersonalizedLearning;
