function hamburger() {
	const hamburger = document.querySelector(".hamburger");
	const hamburgerWrap = hamburger.querySelector(".hamburger__wrapper");
	const topStick = document.querySelector(".hamburger__stick_top");
	const midleStick = document.querySelector(".hamburger__stick_middle");
	const bottomStick = document.querySelector(".hamburger__stick_bottom");
	const menu = document.querySelector(".aside-menu");
	const body = document.querySelector("body");

	function showMenu() {
		hamburgerWrap.classList.add("close");
		hamburgerWrap.classList.remove("activ");
		menu.classList.add("visible");
		menu.classList.remove("hidden");
	}
	function hideMenu() {
		hamburgerWrap.classList.add("activ");
		hamburgerWrap.classList.remove("close");
		menu.classList.remove("visible");
    menu.classList.add("hidden");
    menu.style.display = "flex";
	}

	hideMenu();

	function rotated(stick, deg, pos) {
		stick.style.cssText = `
    transform: rotate(${deg}deg);
    transition: .5s;
    position: ${pos};
    top: 50%`;
	}

	hamburgerWrap.addEventListener("click", closeBtn);
	window.addEventListener("keydown", (e) => {
		if (e.code == "Escape" && hamburger.style.display != "none" && hamburgerWrap.matches(".close")) {
			closeBtn();
		}
	});

	function closeBtn(e) {
		if (hamburgerWrap.matches(".activ")) {
			body.style.overflow = "hidden";
			showMenu();
			setTimeout(() => {
				midleStick.style.display = "none";
				rotated(topStick, -45, "absolute");
				rotated(bottomStick, 45, "absolute");
			}, 200);
		} else if (hamburgerWrap.matches(".close")) {
			body.style.overflow = "";
			setTimeout(() => {
				hideMenu();
				midleStick.style.display = "block";
			}, 300);
			rotated(topStick, 0, "unset");
			rotated(bottomStick, 0, "unset");
		}
	}
}
export { hamburger };
