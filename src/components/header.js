export function generateMainNav() {
  const mainNavs = [
		{ section: "床墊優勢", path: "#adv" },
		{ section: "好評推薦", path: "#comments" },
		{ section: "運送方式", path: "#transportation" },
		{ section: "後台訂單", path: "/js-api-ex/dashboard.html" },
	];

  const mainNav = document.querySelector('#mainNav');

  // set class
  const mainNavClass = "block py-2 lg:py-5 lg:text-2xl leading-normal hover:text-accent transition-all duration-500 font-medium";

  mainNavs.forEach(nav => {
    let a = document.createElement('a')
    a.setAttribute('href', `${nav.path}`);
    a.setAttribute('class', mainNavClass);
    a.textContent = nav.section;
    mainNav.appendChild(a);
  })
}