import { useState, useEffect, useRef } from "react";

const SCI_BUTTONS = [
  "(", ")", "%", "√",
  "sin", "cos", "tan", "^",
  "ln", "log", "exp", "π",
  "asin", "acos", "atan", "!",
  "abs", "mod", "PI", "E",
];

const DIGIT_BUTTONS = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+",
];

function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState("");
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [photoData, setPhotoData] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const fact = (value) => {
    const number = Number(value);
    if (!Number.isInteger(number) || number < 0) {
      throw new Error("Factorial requires a non-negative integer");
    }
    return number === 0 ? 1 : Array.from({ length: number }, (_, i) => i + 1).reduce((acc, current) => acc * current, 1);
  };

  const evaluateExpression = (expression) => {
    const safeExpression = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π/g, "PI")
      .replace(/√/g, "sqrt")
      .replace(/\bmod\b/g, "%")
      .replace(/(\d+)!/g, "fact($1)")
      .replace(/\^/g, "**")
      .replace(/\bPI\b/g, "PI")
      .replace(/\bE\b/g, "E");

    const math = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      asin: Math.asin,
      acos: Math.acos,
      atan: Math.atan,
      sqrt: Math.sqrt,
      ln: Math.log,
      log: Math.log10 ? Math.log10 : (x) => Math.log(x) / Math.LN10,
      exp: Math.exp,
      abs: Math.abs,
      PI: Math.PI,
      E: Math.E,
      fact,
    };

    const argNames = Object.keys(math);
    const argValues = Object.values(math);

    const evaluator = Function(...argNames, `"use strict"; return (${safeExpression})`);
    return evaluator(...argValues);
  };

  const calculate = () => {
    if (!input.trim()) return;

    try {
      const result = evaluateExpression(input);
      if (!Number.isFinite(result)) {
        setInput("Error");
        return;
      }
      const formatted = String(result);
      setHistory((prev) => [{ expression: input, result: formatted }, ...prev].slice(0, 10));
      setInput(formatted);
    } catch {
      setInput("Error");
    }
  };

  const appendInput = (value) => {
    if (value === "C") {
      setInput("");
      return;
    }

    if (value === "⌫") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (value === "=") {
      calculate();
      return;
    }

    setInput((prev) => prev + value);
  };

  const openSearch = (engine) => {
    const preparedQuery = query.trim();
    if (!preparedQuery) return;

    const encoded = encodeURIComponent(preparedQuery);
    const url = engine === "bing"
      ? `https://www.bing.com/search?q=${encoded}`
      : `https://www.google.com/search?q=${encoded}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraError("");
    } catch (err) {
      setCameraError("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhotoData(canvas.toDataURL("image/png"));
  };

  return (
    <div className="calc-shell">
      <section className="calc-panel">
        <div className="calc-display-area">
          <input
            className="calc-display"
            value={input}
            readOnly
            aria-label="Calculator display"
          />
          <div className="calc-action-row">
            <button className="calc-button accent" onClick={() => appendInput("C")}>C</button>
            <button className="calc-button accent" onClick={() => appendInput("⌫")}>⌫</button>
            <button className="calc-button" onClick={() => appendInput("(")}>{"("}</button>
            <button className="calc-button" onClick={() => appendInput(")")}>{")"}</button>
          </div>
        </div>

        <div className="calc-grid">
          {DIGIT_BUTTONS.map((btn) => (
            <button
              key={btn}
              className={btn === "=" ? "calc-button equals" : "calc-button"}
              onClick={() => appendInput(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="calc-science-panel">
          {SCI_BUTTONS.map((btn) => (
            <button
              key={btn}
              className="calc-button science"
              onClick={() => appendInput(btn === "mod" ? "mod" : btn)}
            >
              {btn}
            </button>
          ))}
          <button className="calc-button equals" onClick={calculate}>=</button>
        </div>

        <div className="calc-history">
          <div className="calc-history-heading">History</div>
          {history.length === 0 ? (
            <div className="calc-history-empty">No history yet.</div>
          ) : (
            <ul>
              {history.map((entry, index) => (
                <li key={`${entry.expression}-${index}`}>
                  <span>{entry.expression}</span>
                  <strong>{entry.result}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="calc-sidebar">
        <div className="calc-web-panel">
          <div className="calc-panel-title">Internet Portal</div>
          <input
            className="calc-web-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Google or Bing"
          />
          <div className="calc-web-actions">
            <button className="calc-button web" onClick={() => openSearch("google")}>Google</button>
            <button className="calc-button web" onClick={() => openSearch("bing")}>Bing</button>
          </div>
          <p className="calc-web-note">Search the internet and open results in a new tab.</p>
          <div className="calc-download-sample">
            <p>Use this portal to locate files and download resources for your mission.</p>
          </div>
        </div>

        <div className="calc-camera-panel">
          <div className="calc-panel-title">Camera</div>
          <div className="camera-actions">
            <button className="calc-button camera" onClick={cameraStream ? stopCamera : startCamera}>
              {cameraStream ? "Stop Camera" : "Start Camera"}
            </button>
            <button className="calc-button camera" onClick={takePhoto} disabled={!cameraStream}>
              Capture
            </button>
          </div>
          {cameraError && <div className="camera-error">{cameraError}</div>}
          <div className="camera-viewer">
            <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
            {photoData && (
              <div className="camera-photo-preview">
                <img src={photoData} alt="Captured snapshot" />
                <a href={photoData} download="aura-snapshot.png" className="calc-button download-link">
                  Download Snapshot
                </a>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </section>
    </div>
  );
}

export default Calculator;
