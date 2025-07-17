const golden = 645;
const idol = 795;

document.getElementById('golden-count').textContent = golden;
document.getElementById('idol-count').textContent = idol;

const honmoon = document.getElementById('honmoon');
const status = document.getElementById('honmoon-status');

if (golden > idol) {
  honmoon.classList.add('strong');
  status.textContent = "Honmoon is STRONG (Golden is more popular)";
} else {
  honmoon.classList.add('weak');
  status.textContent = "Honmoon is WEAK (Your Idol is more popular)";
}
