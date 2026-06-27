import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let stars = [];
    
    // Mouse tracking for parallax
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = window.innerWidth < 768 ? 100 : 250;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 2 + 0.1, // Depth for parallax
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          velocity: (Math.random() * 0.05) + 0.01
        });
      }
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const draw = () => {
      // Create a slight trailing effect for hyperspace feel
      ctx.fillStyle = "rgba(5, 7, 10, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Parallax offsets
      const offsetX = (mouseX - canvas.width / 2) * 0.05;
      const offsetY = (mouseY - canvas.height / 2) * 0.05;

      stars.forEach((star) => {
        // Twinkle effect
        star.alpha += Math.random() * 0.04 - 0.02;
        if (star.alpha <= 0.1) star.alpha = 0.1;
        if (star.alpha >= 1) star.alpha = 1;

        // Move stars slowly upward to simulate ship drifting
        star.y -= star.velocity;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        const renderX = star.x - (offsetX / star.z);
        const renderY = star.y - (offsetY / star.z);

        ctx.beginPath();
        ctx.arc(renderX, renderY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 209, 217, ${star.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background: "radial-gradient(ellipse at bottom, #0d111a 0%, #05070a 100%)",
        pointerEvents: "none"
      }}
    />
  );
}