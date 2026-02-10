(function () {
  // 1) создаём canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // 2) стили слоя фона
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.zIndex = "1";          // фон под контентом (контент z-index:2)
  canvas.style.pointerEvents = "none";
  canvas.style.display = "block";

  document.body.prepend(canvas);

  // 3) размер
  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize);
  resize();

  // 4) "блобсы" (мягкие световые пятна)
  const blobs = Array.from({ length: 6 }).map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 180 + Math.random() * 260,
    dx: (Math.random() - 0.5) * 0.22,
    dy: (Math.random() - 0.5) * 0.22,
    a: 0.03 + Math.random() * 0.03
  }));

  // 5) фон подложка
  function paintBase() {
    // тёмная база, чтобы не было "прозрачности"
    ctx.fillStyle = "#0b0c10";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // мягкая виньетка
    const v = ctx.createRadialGradient(
      window.innerWidth * 0.5, window.innerHeight * 0.35, 0,
      window.innerWidth * 0.5, window.innerHeight * 0.5, Math.max(window.innerWidth, window.innerHeight)
    );
    v.addColorStop(0, "rgba(255,255,255,0.04)");
    v.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  // 6) цикл
  function draw() {
    paintBase();

    for (const b of blobs) {
      b.x += b.dx;
      b.y += b.dy;

      if (b.x < -b.r) b.x = window.innerWidth + b.r;
      if (b.x > window.innerWidth + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = window.innerHeight + b.r;
      if (b.y > window.innerHeight + b.r) b.y = -b.r;

      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, `rgba(255,255,255,${b.a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
})();
