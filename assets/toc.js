/*! toc.js - https://github.com/qunitjs/jekyll-theme-amethyst */
const tocElement = document.querySelector('.toc');
const tocItems = [].slice.call(tocElement.querySelectorAll('li > a[href^="#"]'));
const headings = tocItems.map(item => document.getElementById(item.getAttribute('href').slice(1)));

// TOC items of currently-visible headings
//
// If we simply highlight the first `entry.isIntersecting`, then when H2#Examples
// and H3#Foo both become visible, we'd keep highlighting H2#Examples even after it
// leaves the viewport, because H3#Foo was already observed earlier.
// Maintain a list of visible headings and highight the top-most, so that after we
// observe a heading leaving the viewport, we still know what's left.
const currentItems = [];

// After scrollling to a new heading, we scroll the TOC to the same heading.
// Only scroll if the item was not already visible, to reduce distraction.
//
// DIV.toc-wrapper
// | kind: offset parent           # because `position: sticky`
// |
// |- DIV.toc
// |  |  var: tocElement
// |  |  kind: scroll parent       # because `overflow-y: auto;`
// |  |
// |  |  tocElement.offsetTop      # height of any content above tocElement
// |  |  tocElement.scrollTop      # scrollY coord, starts at 0
// |  |  tocElement.clientHeight   # height of visible scrollable area, e.g. 400px
// |  |
// |- |- li > a[href]
//         var: item
//
//         item.offsetTop          # fixed offset from offsetParent
//
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const item = tocItems[headings.indexOf(entry.target)];
      if (entry.isIntersecting && !currentItems.includes(item)) {
        currentItems.push(item);
      } else if (!entry.isIntersecting && currentItems.includes(item)) {
        currentItems.splice(currentItems.indexOf(item), 1);
      }
    }
    // Resort to handle scrolling up, ensure new top-most item is on top
    currentItems.sort((a, b) => a.compareDocumentPosition(b) & 4 ? -1 : 1)

    if (!currentItems[0]) {
      // No headings in the viewport, keep highlighting the last heading we saw.
      return;
    }
    for (const item of tocItems) {
      if (item === currentItems[0]) {
        item.parentNode.classList.add('toc-item-current');

        const itemTop = item.offsetTop - tocElement.offsetTop;
        if (itemTop < tocElement.scrollTop) {
          tocElement.scrollTo({
            top: itemTop - item.clientHeight
          });
        } else if (itemTop > (tocElement.scrollTop + tocElement.clientHeight - item.clientHeight)) {
          tocElement.scrollTo({
            top: itemTop + tocElement.clientHeight - item.clientHeight
          });
        }
      } else {
        item.parentNode.classList.remove('toc-item-current');
      }
    }
  },
  {
    // Support Firefox 136: Include a tiny top margin,
    // because of fragment navigation bug, which scrolls headings to -0.1px of the viewport?
    //
    // Use bottom -50% to consider only the top half of the viewport.
    // When reading a long section of which the heading is long past,
    // we don't highlight the "next" heading until it reaches the top half.
    rootMargin: '2px 0px -50% 0px',
    threshold: [0.8]
  }
);
for (const heading of headings) {
  observer.observe(heading);
}
