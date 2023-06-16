/*
VIDEO
*/

/*
Autoplay for video after scrolling to it
I didn't find other working decision except as with using waypoint function that is part of Waypoints JavaScript library, that can be used to trigger functions when elements enter or leave the viewport.
So I had to add a reference to the Waypoints CDN in settings of the Codepen (because we cannot reach the head section here).
*/
// Create a new script element in the HTML document
let tag = document.createElement("script");
// Set the src attribute of the new script element to the YouTube iframe API URL
tag.src = "https://www.youtube.com/iframe_api";
// Add the new script element to the head section of the HTML document
document.head.appendChild(tag);
// Declare a variable player1
let player1;
// Declare a function, which is called when the YouTube Iframe API is ready
function onYouTubeIframeAPIReady() {
  // Initialize player1 variable that is a new instance of the YT.Player object
  player1 = new YT.Player("player", {
    // The ID of the YouTube video. I took it from link for video
    videoId: "_8kV4FHSdNA",
    // Object with player options
    playerVars: {
      // Show controls on the video
      controls: 1,
      // Loop the video when it finishes
      loop: 1,
    },
    // An object with event handlers for the player
    events: {
      // The onReady event handler is defined to call the videoAutoControl function with the #player selector, the Player object, and 0.5 as the percentage of the video height to toggle playing. The onStateChange event handler is also defined to call the onPlayerStateChange function when the player state changes
      onReady: function (e) {
        e.target.mute();
        videoAutoControl("#player", e.target, 0.5);
      },
    },
  });
}

/*
This function is responsible for controlling the the player playback based on whether it is currently in view or not
The "selector" parameter is the CSS selector for the video element, the "video" parameter is the player object, and the "videoTogglePct" parameter is the percentage of the video's height that triggers the play/pause action.
*/
function videoAutoControl(selector, video, videoTogglePct) {
  /*
  The videoHeightPct variable is calculated as the height of the video element divided by the height of the window. This calculates the percentage of the browser window height that the video element takes up. 
    It is used to calculate the offsetIn and offsetOut values, which are used in the Waypoints plugin to trigger the play/pause action.
  */
  let videoHeightPct = $(selector).height() / $(window).height();
  /* 
  Calculate (in pixels) the offsets for when the video should start and stop playing based on the percentage of the video's height and the videoTogglePct argument. 
  In my case videoTogglePct is 0.5, so the video will start playing when 50% of the video element is visible
  */
  let offsetIn = (1 - videoTogglePct * videoHeightPct) * 100;
  let offsetOut = -(videoTogglePct * videoHeightPct) * 100;

  // Functions for playing and pausing the video player
  function inView(video) {
    // console.log("in view"); //I used this for testing
    video.playVideo();
  }
  function outView(video) {
    // console.log("out of view"); //I used this for testing
    video.pauseVideo();
  }

  /*
  Set up a waypoint event listener on the video player. When the video player enters the viewport and is scrolling down, it triggers the inView function and starts playing the video. When it exits the viewport, it triggers the outView function and pauses the video
  */
  $(selector).waypoint(
    function (direction) {
      if (direction == "down") inView(video);
      // Visible range goes down；The video enters the visible range from the bottom and plays
      else outView(video); // The video leaves and pauses
    },
    {
      offset: offsetIn + "%",
    }
  );
  $(selector).waypoint(
    function (direction) {
      if (direction == "up") inView(video);
      // The video enters the visible range from the top and plays
      else outView(video); // The video leaves and pauses
    },
    {
      offset: offsetOut + "%",
    }
  );
}

    

    document.addEventListener("DOMContentLoaded", function() {

      /*
      NAVIGATION
      */

      /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the "burger" icon */

      const nav_res = document.getElementById("navigation");
      const topbar_res = document.getElementById("topbar");

      const homepage_res = document.getElementById("homepage");
      const icon_link = document.getElementById("icon");

      if (icon_link) {
        icon_link.addEventListener("click", function () {
          const anchor_res = document.getElementsByClassName("anchored");
          for (const anchor of anchor_res) {
            anchor.classList.toggle("responsive");
          }
          nav_res.classList.toggle("responsive");
          topbar_res.classList.toggle("responsive");

          homepage_res.classList.toggle("responsive");
        });
      }

      // Add event listener to detect clicks outside of topbar_res for closing burger menu
      document.addEventListener("click", function(event) {
        const target = event.target;
        const isInsideTopbar = topbar_res.contains(target);
        
        if (!isInsideTopbar && topbar_res.classList.contains("responsive")) {
          const anchor_res = document.getElementsByClassName("anchored");
          for (const anchor of anchor_res) {
            anchor.classList.remove("responsive");
          }
          nav_res.classList.remove("responsive");
          topbar_res.classList.remove("responsive");
          homepage_res.classList.remove("responsive");
        }
      });

      // Make the clicked link in the navigation menu active - change background color and also make it active while scrolling

      // Select all navigation links
      const nav_links = document.querySelectorAll("nav li a");
      // Select all anchor elements with the class .anchored
      const anchors = document.querySelectorAll(".anchored");
      // Add a scroll event listener to the window object
      window.addEventListener("scroll", function () {
        // Get the current scroll position
        const current_scroll = window.pageYOffset;
        // Loop through all anchors
        anchors.forEach(function (anchor) {
          // Get the offset top of the anchor
          const anchor_top = anchor.offsetTop;
          // After testing the code I realized that I need to add the height of the fixed topbar for changing the tabs in the navigation menu when reaching anchors more precise
          // Select the topbar
          let topbar = document.querySelector("#topbar");
          // Get the height of the topbar
          let topbar_height = topbar.offsetHeight;
          // Check if the current scroll position is above the anchor minus topbar
          if (current_scroll >= anchor_top - topbar_height) {
            // Loop through all navigation links
            nav_links.forEach((link) => {
              // Remove the active class from all links
              link.classList.remove("active");
              // Add the active class only to the link that corresponds to the current anchor
              if (link.getAttribute("href") === "#" + anchor.name) {
                link.classList.add("active");
              }
            });
          }
          // Check if the user reaches the footer, because otherwise on big screens footer wasn't highlighted in the navigation menu
          // Select the footer
          const footer = document.querySelector("footer");
          // Get the height of the footer
          const footer_height = footer.offsetHeight;
          // Get the height of the whole webpage
          const page_height = document.documentElement.scrollHeight;
          // Get the height of the viewport
          const window_height = window.innerHeight;
          // Count the checkpoint where the footer link in navbar should become active
          // I took the whole height of the page and substracted the height of the window's layout viewport minus the height of the footer plus the height of topbar
          const checkpoint =
            page_height - window_height - footer_height + topbar_height;
          // Check if the current scroll position is above the checkpoint
          if (current_scroll >= checkpoint) {
            // Remove the active class from all links
            nav_links.forEach((link) => {
              link.classList.remove("active");
            });

                /* 
            other way to do the same
              for (let i = 0; i < navLinks.length; i++) {
                navLinks[i].classList.remove("active");
              }
              */

            //Add the active class to the link for the footer
            document.querySelector('a[href="#footer"]').classList.add("active");
          }
        });
      });

      /*
      LIGHTBOX
      */

      // Declare variables
      // Get all thumbnail images
      const thumbnail_imgs = document.querySelectorAll(".thumbnails");
      // Get thumbnail captions and index variables
      const tb_caption = document.querySelectorAll(".tb-caption");
      // Get the lightbox image and element
      const lightbox_img = document.getElementById("lightbox-img");
      const lightbox = document.getElementById("lightbox");
      // Get all site images and convert to array
      const site_images = document.querySelectorAll(".for-lightbox");
      const array_si = Array.from(site_images);

      // Function to add click event listener to images
      function addImageClickHandler(myImage, ind) {
        // Find index of clicked image in site images array
        let index = array_si.findIndex((img) => img.src === myImage.src);
        // Add lightbox class to modal to make it visible and set lightbox image to clicked image
        lightbox.classList.add("lb-active");
        lightbox_img.src = array_si[index].src;
        document.getElementById("lb-caption").innerHTML =
          "<p>" + array_si[index].alt + "</p>";
        // Loop through thumbnail images and set their src to the next site image
        thumbnail_imgs.forEach((tb, i) => {
          let si_index = (index + i + 1) % array_si.length;
          tb.src = array_si[si_index].src;
        });
        // Loop through thumbnail captions and set their content to the next site image alt text
        tb_caption.forEach((caption, i) => {
          let si_index = (index + i + 1) % array_si.length;
          caption.innerHTML = "<p>" + array_si[si_index].alt + "</p>";
        });
      }

      // Function to add click event listener to thumbnail images
      function addTbClickHandler(tb, ind) {
        addImageClickHandler(tb, ind);
      }

      // Loop through site images and add click event listener to each image
      array_si.forEach((myImage, index) => {
        myImage.addEventListener("click", () => {
          addImageClickHandler(myImage, index);
        });
      });
      // Loop through thumbnail images and add click event listener to each image
      thumbnail_imgs.forEach((tb, ind) => {
        tb.addEventListener("click", () => {
          addTbClickHandler(tb, ind);
        });
      });

      // Get close button and add click event listener to remove active class from lightbox (close the modal)
      const close_button = document.getElementById("lightbox-close");
      if (close_button) {
        close_button.addEventListener("click", function () {
          // Close the modal
          lightbox.classList.remove("lb-active");
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
              // Close the modal if the Esc key is pressed:
              lightbox.classList.remove("lb-active");
          }
      });
      }

      // Set initial index to 0 for image navigation
      let current_index = 0;
      // Function to display previous image
      function prevImage() {
        current_index--;
        if (current_index < 0) {
          current_index = site_images.length - 1;
        }
        // Set lightbox image to previous image
        const current_image = site_images[current_index];
        lightbox_img.src = current_image.src;
        // Set caption for previous image
        document.getElementById("lb-caption").innerHTML =
          "<p>" + current_image.alt + "</p>";
        // Loop through thumbnail images and set their src to the next site image
        thumbnail_imgs.forEach((thumb, index) => {
          thumb.src =
            site_images[(current_index + index + 1) % site_images.length].src;
        });
        // Iterates through each thumbnail caption element and updates the content
        // with the corresponding image's alt text, based on the current image index
        tb_caption.forEach((tb, index) => {
          tb.innerHTML =
            "<p>" +
            site_images[(current_index + index + 1) % site_images.length].alt +
            "</p>";
        });
      }

      // Function that handles the click on the "Next" arrow button
      function nextImage() {
        current_index++;
        if (current_index >= site_images.length) {
          current_index = 0;
        }
        // Sets the image source of the lightbox image element to the current image
        const current_image = site_images[current_index];
        lightbox_img.src = current_image.src;
        // Updates the caption of the lightbox image element with the current image's alt text
        document.getElementById("lb-caption").innerHTML =
          "<p>" + current_image.alt + "</p>";
        // Updates the thumbnails and their captions based on the current image index

        thumbnail_imgs.forEach((thumb, index) => {
          thumb.src =
            site_images[(current_index + index + 1) % site_images.length].src;
        });
        tb_caption.forEach((tb, index) => {
          tb.innerHTML =
            "<p>" +
            site_images[(current_index + index + 1) % site_images.length].alt +
            "</p>";
        });
      }

      // Retrieves the "Previous" and "Next" arrow button elements and attaches event listeners
      // to call the corresponding function when clicked
      const lightbox_arrow_left = document.getElementById("lightbox-arrow-left");
      const lightbox_arrow_right = document.getElementById(
        "lightbox-arrow-right"
      );

      if (lightbox_arrow_left) {
        lightbox_arrow_left.addEventListener("click", () => {
          prevImage();
        });
      }

      if (lightbox_arrow_right) {
        lightbox_arrow_right.addEventListener("click", () => {
          nextImage();
        });
      }

      /*
      TOOLTIPS FOR HIGHLIGHTED WORDS IN HISTORY OF ASANAS SECTION

      This script is for tooltips. It targets all the elements with the class "hint" and creates a tooltip when the element is hovered over or clicked.
      */

      // get all elements with class "hint"
      const hint_elements = document.querySelectorAll(".hint");

      // create a function to handle the hover and click events
      function handleEvent(event) {
        // check if there is already a tooltip element on the page. If it exists, remove it.
        const existing_tooltip_element = document.querySelector(".hint-tooltip");
        if (existing_tooltip_element) {
          existing_tooltip_element.parentNode.removeChild(
            existing_tooltip_element
          );
        }

        // get the data-tooltip attribute value from the current hint element
        const tooltip_text = event.currentTarget.getAttribute("data-tooltip");

        /*
        Create a new span element with class "hint-tooltip" and set the tooltip text as   the new span element's innerHTML.
        */
        const tooltip_element = document.createElement("span");
        tooltip_element.classList.add("hint-tooltip");

        // set the tooltip text as the new span element's innerHTML
        tooltip_element.innerHTML = tooltip_text;

        // append the new span element as a child of the current hint element
        event.currentTarget.appendChild(tooltip_element);

        // Check if the tooltip is going off the right edge of the screen
        let el = document.querySelector(".hint-tooltip");
        let bound_right = el.getBoundingClientRect().right;
        let window_width = document.documentElement.clientWidth;
        if (bound_right > window_width - 5) {
          // Correct the position of the tooltip so it's inside the screen
          let delta_right = window_width - bound_right;
          // Apply corrected position. I added 5px everywhere just to have some space between tooltip and the edge of the screen
          tooltip_element.style.left = delta_right - 5 + "px";
        }

        // Check if the tooltip is going off the bottom of the screen
        let bound_bottom = el.getBoundingClientRect().bottom;
        let window_height = document.documentElement.clientHeight;
        let bound_top = el.getBoundingClientRect().top;
        if (bound_bottom > window_height) {
          // Correct the position of the tooltip so it's above the hint element
          let delta_bottom = window_height - bound_bottom;
          let el_height = bound_bottom - bound_top;
          // Apply corrected position
          tooltip_element.style.top = -el_height + "px";
          // Add some styling for animation and shadow to make a tooltip look like it's mirrored up
          tooltip_element.style.setProperty("--keyframes", "20px");
          tooltip_element.style.boxShadow =
            "0px -20px 17px 0px rgb(0 0 0 / 18%), 0px 0px 5px 12px rgb(0 0 0 / 0%)";
        }

        /*
        Add a touchstart event listener to the document object to remove the tooltip when touching outside of the hint element
        */

          /*
        I spent the whole day to understand what is wrong in this code for tooltips! 
        It worked totally wrong on smartphones. 
        I started to check everything very carefully and finally came to this string... and solution was so easy - just to replace here "click" with "touchstart"!... facepalm...
        */

        document.addEventListener("touchstart", (e) => {
          if (!e.target.closest(".hint")) {
            const tooltip_element = document.querySelector(".hint-tooltip");
            if (tooltip_element) {
              tooltip_element.parentNode.removeChild(tooltip_element);
            }
          }
        });
      }

      // Add the event listeners for each hint element
      hint_elements.forEach((hint_element) => {
        // Add mouseenter and click events to show the tooltip
        hint_element.addEventListener("mouseenter", handleEvent);
        hint_element.addEventListener("click", handleEvent);
        // Add mouseleave event to hide the tooltip
        hint_element.addEventListener("mouseleave", () => {
          const tooltip_element = hint_element.firstElementChild;
          if (tooltip_element) {
            hint_element.removeChild(tooltip_element);
          }
        });
      });

      /*
      SUBSCRIPTION
      */

      // Code for subscription form
      // Get the form element by its ID
      let form = document.getElementById("submit-email");

      // Add an event listener to the form that listens for a "submit" event and calls the "runEvent" function
      if (form) {
        form.addEventListener("submit", (e) => {
          // Define the "runEvent" function that prevents the form from submitting, and displays an alert thanking the user for subscribing
          e.preventDefault();
          alert("Thanks for subscribing!");
        });
      }



    });
// }
