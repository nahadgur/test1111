const videos = [
  { id: "HKZ-wcZfQqk", title: "Company profile", label: "AYS company profile" },
  { id: "w61bxEMxzHo", title: "What AYS does", label: "An introduction to the AYS business" },
  { id: "9S-72Uu42oY", title: "Problems AYS addresses", label: "Common service challenges" },
  { id: "NwhkkwNDG5s", title: "Ways to earn", label: "Ways to earn with AYS" },
  { id: "nsZSrJ4sCWU", title: "Building a community", label: "Why the AYS network matters" },
  { id: "3jkCMrZnmmg", title: "More technology opportunities", label: "Other ways to take part" }
];

let currentVideo = 0;
const frame = document.querySelector("#video-frame");
const title = document.querySelector("#video-title");
const step = document.querySelector("#video-step");
const progress = document.querySelector("#progress-bar");
const videoButtons = [...document.querySelectorAll(".video-item")];

function selectVideo(index) {
  currentVideo = (index + videos.length) % videos.length;
  const video = videos[currentVideo];
  frame.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0`;
  frame.title = video.label;
  title.textContent = video.title;
  step.textContent = `Part ${currentVideo + 1} of ${videos.length}`;
  progress.style.width = `${((currentVideo + 1) / videos.length) * 100}%`;
  videoButtons.forEach((button, i) => {
    button.classList.toggle("active", i === currentVideo);
    button.setAttribute("aria-current", i === currentVideo ? "step" : "false");
  });
}

videoButtons.forEach(button => button.addEventListener("click", () => selectVideo(Number(button.dataset.index))));
document.querySelector("#prev-video").addEventListener("click", () => selectVideo(currentVideo - 1));
document.querySelector("#next-video").addEventListener("click", () => selectVideo(currentVideo + 1));

const toast = document.querySelector("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

document.querySelector("#copy-link").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("Profile link copied");
  } catch {
    showToast("Copy unavailable in this browser");
  }
});

document.querySelector("#save-contact").addEventListener("click", () => {
  const vcard = [
    "BEGIN:VCARD", "VERSION:3.0", "FN:Noel N. Cobangbang", "TITLE:AYS Neopreneur",
    "URL:https://1neoai.com/aysnoelcobangbang", "END:VCARD"
  ].join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
  link.download = "noel-cobangbang.vcf";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Contact card downloaded");
});

const dateInput = document.querySelector("#appointment-date");
dateInput.min = new Date().toISOString().split("T")[0];
const form = document.querySelector("#appointment");
const formMessage = document.querySelector("#form-message");
const modal = document.querySelector("#appointment-modal");

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.checkValidity()) {
    formMessage.textContent = "Please complete the date, time, name, and email fields.";
    form.reportValidity();
    return;
  }
  formMessage.textContent = "";
  const name = document.querySelector("#appointment-name").value.trim();
  const time = new FormData(form).get("time");
  const date = new Date(`${dateInput.value}T12:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  document.querySelector("#appointment-summary").innerHTML = `<strong>${name}</strong><span>${date} · ${time}</span>`;
  modal.showModal();
});

document.querySelector(".modal-close").addEventListener("click", () => modal.close());
document.querySelector("#done-button").addEventListener("click", () => modal.close());
modal.addEventListener("click", event => {
  const box = modal.getBoundingClientRect();
  const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  if (outside) modal.close();
});
