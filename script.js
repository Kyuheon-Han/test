/* ======== 캔버스 초기화 ======== */
const canvas = document.getElementById('rainCanvas');
const ctx     = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ======== 빗방울 클래스 정의 ======== */
class Drop {
  constructor() {
    this.reset();
  }

  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * -canvas.height;  // 화면 위쪽에서 시작
    this.z  = Math.random() * 0.5 + 0.5;       // 가까움·멀어짐 효과 (0.5~1.0)
    this.len= 10 * this.z + 8;
    this.vy = 4 * this.z + 3;
    this.vx = 0;
  }

  update(mx, my) {
    // 마우스 반발력
    const dx = this.x - mx;
    const dy = this.y - my;
    const dist = Math.hypot(dx, dy);
    const radius = 120; // 마우스 영향 범위(px)

    if (dist < radius) {
      // 거리가 가까울수록 더 멀리 튀도록 선형 보간
      const force = (1 - dist / radius) * 8;
      const angle = Math.atan2(dy, dx);
      this.vx += Math.cos(angle) * force;
      this.vy += Math.sin(angle) * force;
    }

    // 중력 비슷한 효과
    this.vy += 0.02;

    // 위치 갱신
    this.x += this.vx;
    this.y += this.vy;

    // 약간의 공기 저항
    this.vx *= 0.95;
    this.vy *= 0.98;

    // 화면을 벗어나면 초기화
    if (this.y > canvas.height || this.x < -50 || this.x > canvas.width + 50) {
      this.reset();
      this.y = -this.len;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(135,206,235,' + (0.45 * this.z + 0.35) + ')'; // 하늘색 + 깊이
    ctx.lineWidth = 1.2 * this.z + 0.3;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.vx * 0.2, this.y + this.len);
    ctx.stroke();
  }
}

/* ======== 빗방울 생성 ======== */
const drops = [];
const dropCount = Math.floor((canvas.width * canvas.height) / 4500); // 해상도에 비례
for (let i = 0; i < dropCount; i++) drops.push(new Drop());

/* ======== 마우스 좌표 추적 ======== */
let mouseX = -9999, mouseY = -9999; // 기본값: 화면 밖
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouseX = mouseY = -9999; // 마우스가 페이지 밖으로 나가면 효과 끔
});

/* ======== 애니메이션 루프 ======== */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const d of drops) {
    d.update(mouseX, mouseY);
    d.draw();
  }

  requestAnimationFrame(animate);
}
animate();
