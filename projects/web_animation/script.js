document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.code-panel');
    panel.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    panel.querySelector(`.tab-content[data-lang="${btn.dataset.lang}"]`).classList.add('active');
  });
});
