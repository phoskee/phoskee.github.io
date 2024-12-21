"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";


interface Point {
  x: number;
  y: number;
}

export default function SierpinskiTriangle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialPoint, setInitialPoint] = useState<Point | null>(null);
  const [vertices, setVertices] = useState<Point[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [pointsPerFrame, setPointsPerFrame] = useState<number>(10);
  const [pointSize, setPointSize] = useState<number>(1);
  const [pointColor, setPointColor] = useState<string>("#000000");
  const [maxPoints, setMaxPoints] = useState<number>(10000);
  const animationFrameRef = useRef<number>();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = document.querySelector('.canvas-container');
      if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        setCanvasSize({ width, height });
        
        setVertices([
          { x: width / 2, y: 10 },
          { x: 10, y: height - 10 },
          { x: width - 10, y: height - 10 },
        ]);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const resetCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setInitialPoint(null);
    setPoints([]);
    
    vertices.forEach(({ x, y }) => {
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(x - 2, y - 2, 4, 4);
    });
  };

  useEffect(() => {
    if (initialPoint) {
      if (!canvasRef.current) return;
      let currentPoint: Point = initialPoint;
      const ctx = canvasRef.current.getContext("2d")!;
      ctx.fillStyle = pointColor;

      vertices.forEach(({ x, y }) => {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(x - 2, y - 2, 4, 4);
      });

      const draw = () => {
        ctx.fillStyle = pointColor;
        for(let i = 0; i < pointsPerFrame; i++) {
          const targetVertex = vertices[Math.floor(Math.random() * 3)]!;
          currentPoint = {
            x: (currentPoint.x + targetVertex.x) / 2,
            y: (currentPoint.y + targetVertex.y) / 2,
          };
          ctx.fillRect(
            currentPoint.x - pointSize/2, 
            currentPoint.y - pointSize/2, 
            pointSize, 
            pointSize
          );
        }

        if (points.length < maxPoints) {
          animationFrameRef.current = requestAnimationFrame(draw);
        }
      };

      animationFrameRef.current = requestAnimationFrame(draw);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [initialPoint, pointsPerFrame, pointSize, pointColor, maxPoints]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
	console.log(rect)
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setInitialPoint({ x, y });
    setPoints([]);
  };

  return (
    <div className="flex items-center justify-center gap-2 rounded-md border p-2">
      <div className="rounded-md border p-2 flex flex-col gap-4">
        <h1>Triangolo di Sierpiński</h1>
        <div className="flex flex-col gap-4">
          <Label className="mr-2">Velocità: {pointsPerFrame}</Label>
          <Slider
            min={1}
            max={100}
            value={[pointsPerFrame]}
            onValueChange={(value) => setPointsPerFrame(value[0] ?? 1)}
            className="w-48"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label className="mr-2">Dimensione punti: {pointSize}</Label>
          <Slider
            min={1}
            max={5}
            step={0.5}
            value={[pointSize]}
            onValueChange={(value) => setPointSize(value[0] ?? 1)}
            className="w-48"
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label className="mr-2">Colore punti:</Label>
          <Input
            type="color"
            value={pointColor}
            onChange={(e) => setPointColor(e.target.value)}
          />
        </div>
        <div>
          <Label className="mr-2">Limite punti: {maxPoints}</Label>
          <Slider
            min={1000}
            max={50000}
            step={1000}
            value={[maxPoints]}
            onValueChange={(value) => setMaxPoints(value[0] ?? 1000)}
            className="w-48"
          />
        </div>
        <Button
          onClick={resetCanvas}
		  className="w-full"
        >
          Reset
        </Button>
        
      </div>
      <div className="canvas-container h-[85svh] aspect-square">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="w-full h-full cursor-pointer rounded-md border"
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  );
}
