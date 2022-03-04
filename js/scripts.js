gsap.registerPlugin(ScrollTrigger);

let subdomainIsOn = false,
    domainIsOn = true,
    debounce = 100,
    pillsCnt = document.querySelector(".domain-cnt"),
    pills = Array.from(document.querySelectorAll(".domain")),
    subdomainCnt = document.getElementById("subdomains-cnt"),
    subSections = Array.from(document.querySelectorAll(".subdomains-section")),
    searchBox = document.getElementById("search-box"),
    contentWrapper = document.getElementById("content-wrapper"),
    header = document.querySelector("header"),
    pinnedPill = null,
    images = Array.from(document.querySelectorAll(".carousel-item")),
    currentCarouselImage = 0,
    previousSubdomainSection,
    thumbnails = Array.from(document.querySelectorAll(".thumbnail")),
    pinnedPills = [],
    triggered = false,
    minimized = false;



/////////////////////////
// SEARCHBOX INTERACTIONS
/////////////////////////

// Pinned pill behavior
let pillClicked = (element) => {

    // corresponding subdomain section
    let subdomainSection = subSections.filter(subs => subs.classList.contains(element.classList[2]))[0]

    // if not pinned yet
    if (!element.querySelector(".pin").classList.contains("pinned")) {

        // pin and store
        pinnedPills.push(element)
        element.querySelector(".pin").classList.add("pinned");

        subdomainSection.querySelectorAll("input").forEach(subdomain => {
            subdomain.checked = true
        })

        // grey the othres
        pills.filter(pill => !pinnedPills.includes(pill)).forEach(greypill => {
            if (!greypill.classList.contains("greyedout")) {
                greypill.classList.add("greyedout")
            }
        });


    } else {
        // if it is pinned already, unpin it
        pinnedPills.splice(pinnedPills.indexOf(element), 1);
        element.querySelector(".pin").classList.remove("pinned");

        subdomainSection.querySelectorAll("input").forEach(subdomain => {
            subdomain.checked = false
        })

        if (!element.classList.contains("greyedout")) {
            element.classList.add("greyedout")
        }

    }


    if (pinnedPills.length == 0) {
        pills.forEach(greypill => {
            if (greypill.classList.contains("greyedout")) {
                greypill.classList.remove("greyedout")
            }
        });
    }
}

// Expand subdomain container
let expand = (el) => {

    el.classList.remove("greyedout");

    pills.filter(pill => pill != el).forEach(greypill => {
        if (!pinnedPills.includes(greypill)) {
            greypill.classList.add("greyedout")
        }
    });

    if (subdomainIsOn == false) {
        subdomainCnt.classList.add("expanded")
    }

    //el.querySelector("img ").classList.add("pin ");

    if (el.classList.contains("humanities")) {
        colorPill("#F5E3A6", 0);
    } else if (el.classList.contains("science")) {
        colorPill("#96EFAA", 1);
    } else if (el.classList.contains("markets")) {
        colorPill("#F4B5B1", 2);
    }
}

// Collapse subdomain container
let collapse = () => {

    if (pinnedPills.length == 0) {
        pills.filter(pill => !pinnedPills.includes(pill)).forEach(pill => {
            if (pill.classList.contains("greyedout")) {
                pill.classList.remove("greyedout")
            }
        })
    }

    subdomainCnt.classList.remove("expanded")


}

// On subdomain container change
let colorPill = (color, i) => {
    subdomainCnt.style.backgroundColor = color

    let tl = gsap.timeline();

    if (previousSubdomainSection != null && previousSubdomainSection != subSections[i]) {
        subSections.filter(subsection => subsection != subSections[i]).forEach(subsection => {
            tl.staggerTo(subsection.querySelectorAll(".subdomain"), 0.1, {
                ease: "Power4.out",
                transformOrigin: "top left",
                opacity: 0,
                scale: 0,
                delay: 0,
            }, -0.02, 0, () => {
                subsection.style.display = "none"
                previousSubdomainSection.style.display = "none"
            })
        })
    }


    if (previousSubdomainSection != subSections[i]) {
        tl.staggerFromTo(subSections[i].querySelectorAll(".subdomain"), 0.1, {
            ease: "Power4.out",
            transformOrigin: "top left",
            opacity: 0,
            scale: 0,
            delay: 0,
            onEnter: () => {
                subSections[i].style.display = "flex"

                thumbnails[i].classList.add("tb-active");

                let otherThumbs = thumbnails.filter(tb => tb != thumbnails[i]);

                otherThumbs.forEach(otherThumb => {
                    if (otherThumb.classList.contains("tb-active")) {
                        otherThumb.classList.remove("tb-active")
                    }
                })


            }
        }, {
            ease: "Power4.out",
            transformOrigin: "top left",
            opacity: 1,
            scale: 1,
            delay: 0,
        }, 0.02)

    }



    previousSubdomainSection = subSections[i];

}

// Pill onmouseover
let domainOn = (e, el) => {
    e.stopPropagation()
    let element = el

    if (element != undefined) {
        expand(element);
    }
}

let domainsOff = () => {
    domainIsOn = false;
}

let backOn = () => {
    domainIsOn = true;
}

// Pill container onmouseout
let domainsCntOff = () => {

    domainIsOn = false;

    document.querySelector(".domain-cnt").addEventListener("mouseover", backOn);
    document.querySelector(".domain-cnt").addEventListener("mouseleave", domainsOff);

    setTimeout(() => {


            if (subdomainIsOn == false && domainIsOn == false) {
                // IF ALSO SUBDOMAIN IS NOT HOVERED THEN COLLAPSE EVERYTHING
                // TODO COLLAPSE
                collapse();
                document.querySelector(".domain-cnt").removeEventListener("mouseover", backOn);
                document.querySelector(".domain-cnt").removeEventListener("mouseleave", domainsOff);

            }
        }, 500 + debounce)
        // DOMAIN IS NOT HOVERED

}

// Subdomain container onmouseover
let subdomainsOn = () => {
    subdomainIsOn = true;
}

// Subdomain container onmouseout
let subdomainsOff = () => {
    subdomainIsOn = false;


    setTimeout(() => {
        if (domainIsOn == false) {
            collapse();
        } else {
            // LISTEN FOR NEWLY HOVERED PILL
        }
    }, debounce);

}

// Subdomain checker state change
let subdomainClicked = (element) => {
    let parent = element.closest(".subdomains-section")
    let others = Array.from(parent.querySelectorAll("input")).filter(input => input.checked)
    let correspondingPill = searchBox.querySelector("." + parent.classList[1])


    if (element.checked && others.length == 1) {

        console.log("yes")
        pillClicked(correspondingPill);
    }
}

// Searchbox scroll-behavior 
let searchBoxAnimation = (reverse) => {

    let parent = searchBox.parentNode === contentWrapper ? header : contentWrapper


    if (triggered == false && reverse == false) {

        triggered = true

        gsap.set(".phantom-box", {
            height: 41,
            opacity: 0,
            border: "1px solid #2f2f2f30",
            y: -300,
            delay: 0
        }, 0)

        let child = document.getElementById("hamburger")

        let tl = gsap.timeline({
            onComplete: () => {
                minimized = true
                triggered = false
            }
        })

        if (parent.contains(child)) {
            parent.insertBefore(searchBox, child);

            tl.to("#search-box", {
                    duration: 0.35,
                    ease: "power3.inOut",
                    height: 60,
                    marginTop: 0,
                    delay: 0
                }, 0)
                .to(".phantom-box", {
                    duration: 0.35,
                    ease: "power3.inOut",
                    opacity: 1,
                    marginTop: 8,
                    y: 0,
                    delay: 0
                }, 0)
                .to("#subdomains-cnt", {
                    duration: 0.35,
                    ease: "power3.inOut",
                    marginTop: 8,
                    delay: 0
                }, 0)
                .to(".placeholder", {
                    duration: 0.35,
                    ease: "power3.out",
                    lineHeight: "41px",
                    fontSize: 18,
                    delay: 0
                }, 0)
                .to(".domain", {
                    duration: 0.35,
                    ease: "power3.out",
                    height: 37,
                    margin: "2px 3px !important",
                    delay: 0
                }, 0)
                .to(".filters-btn", {
                    duration: 0.35,
                    ease: "power3.out",
                    height: 37,
                    delay: 0
                }, 0)
                .to(".domain span", {
                    duration: 0.35,
                    ease: "power3.out",
                    lineHeight: "41px",
                    delay: 0
                }, 0)
                .to("header", {
                    duration: 0.35,
                    ease: "power3.out",
                    backgroundColor: "#EFEFE3",
                    delay: 0
                }, 0);
        }


    } else if (triggered == false && reverse == true) {
        triggered = true

        let child = document.getElementById("personal-space-cnt")

        let tl = gsap.timeline({
            onComplete: () => {
                minimized = false
                triggered = false
            }
        })

        if (parent.contains(child)) {
            parent.insertBefore(searchBox, child);

            tl.to("#search-box", {
                    duration: 0.35,
                    ease: "power3.inOut",
                    height: 80,
                    marginTop: 40,
                    delay: 0
                }, 0)
                .to(".phantom-box", {
                    duration: 0.35,
                    ease: "power3.in",
                    height: 54,
                    marginTop: 0,
                    border: "1px solid #2f2f2f00",
                    delay: 0
                }, 0)
                .to(".placeholder", {
                    duration: 0.35,
                    ease: "power3.in",
                    lineHeight: "54px",
                    fontSize: 23,
                    delay: 0
                }, 0)
                .to(".domain", {
                    duration: 0.35,
                    ease: "power3.in",
                    height: 46,
                    margin: "4px 2px !important",
                    delay: 0
                }, 0)
                .to(".filters-btn", {
                    duration: 0.35,
                    ease: "power3.in",
                    height: 46,
                    delay: 0
                }, 0)
                .to(".domain span", {
                    duration: 0.35,
                    ease: "power3.in",
                    lineHeight: "46px",
                    delay: 0
                }, 0)
                .to("header", {
                    duration: 0.35,
                    ease: "power3.out",
                    backgroundColor: "#EFEFE300",
                    delay: 0
                }, 0);
        }


    }

}


/////////////////////////
// CAROUSEL
/////////////////////////

// Arrow clicked
let carouselMove = (direction) => {

    if (direction == 'right' && currentCarouselImage < images.length - 1) {
        currentCarouselImage++

    } else if (direction == 'left' && currentCarouselImage > 0) {
        currentCarouselImage--
    }


    let imageWidth = document.querySelector(".carousel-item").getBoundingClientRect().width,
        distance = currentCarouselImage * imageWidth;


    for (let i = 0; i < images.length; i++) {
        gsap.to(images[i], {
            duration: 0.5,
            ease: "power3.inOut",
            x: -distance
        })
    }
}

// Image scroll animation
let imageAnimation = () => {
    gsap.to("#carousel-image", {
        scrollTrigger: {
            trigger: "#carousel-image",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1
        },
        scale: 1.0,
        y: 0,
        ease: "power3.inOut",
        duration: 2.8
    })
}



/////////////////////////
// ON DOCUMENT READY
/////////////////////////

// Start animation
let initAnimations = () => {
    window.scrollTo(0, 0)

    // TODO check mobile

    window.addEventListener('scroll', (e) => {

        let threshold = 290
        let scroll = window.scrollY

        if (scroll >= threshold && minimized == false) {
            searchBoxAnimation(false);
        } else if (scroll < threshold && scroll >= 0 && minimized == true) {
            searchBoxAnimation(true);
        }
        e.stopPropagation()
    });
    imageAnimation();
}

initAnimations();