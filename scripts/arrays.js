// console.log(data);
// 1. instead of creating the cards manually, we should use array functions to convert the data into cards

// now we need to get the data in some other way

// 1. we need to get the data from somewhere

const locationOfData = "data.json";
let data = {};
let courseCards = [];
let filteredCourses = [];
let filteredCourseCards = [];
const resultsContainer = document.querySelector("#filtered-results");

function timeParity(cb) {
  setTimeout(() => {
    let t = Date.now() / 1000;
    console.log("t", t);
    console.log("t", t % 2 === 1 ? "odd" : "even");
    cb(t % 2 === 1 ? "odd" : "even");
  }, Math.random() * 1000);
}

function dataLocationFromParity(p) {
  return locationOfData.replace('data.', `data-${p}.`);
}

//callback version
function reqListener() {
  console.log("reqListener");
  const structuredData = JSON.parse(this.responseText);
  console.log("structuredData", structuredData);
  data = structuredData;
  init();
}
const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open("GET", locationOfData);
req.send();

// Use callbacks with XMLHttpRequest to:
// get data.json (provided as “callback version”)
//  for each course,
//    get the detailed info about that course <prefix+number>.json
//      log the detailed info
//      get the timeParity
//        get the data file corresponding to the timeParity (dataLocationFromParity can help)
//        log the parity-text



//promises version

// function logWhenSuccessful (response) {
//   console.log("response", response);
//   return response;
// }

// function dealWithException (err) {
//   console.error(err);
// }

// const responsePromise = fetch(locationOfData)
// responsePromise.then(logWhenSuccessful)
// responsePromise.catch(dealWithException)

const courseToCard = ({
  prefix,
  number,
  title,
  url,
  desc,
  prereqs,
  credits,
}) => {
  const prereqLinks = prereqs
    .map((prereq) => `<a href="#" class="card-link">${prereq}</a>`)
    .join();
  const courseTemplate = `<div class="col">
            <div class="card" style="width: 18rem;">
              <h3 class="card-header"><a href="${url}">${title}</a></h3>
              <div class="card-body">
                <h5 class="card-title">${prefix} ${number}</h5>
                <p class="card-text">${desc}</p>
                ${prereqLinks}
                <div class="card-footer text-muted">
                  ${credits}
                </div>
              </div>
            </div>
          </div>`;
  return courseTemplate;
};

function init() {
  filteredCourses = data.items;
  courseCards = data.items.map(courseToCard);
  filteredCourseCards = courseCards;
  resultsContainer.innerHTML = filteredCourseCards.join("");
  updateCount();
}
// courseCards.forEach((c) => document.write(c));

// console.log(courseCards);
// document.write(courseCards.join(''))

// 2. maybe we only show those that match the search query?
//

const filterCourseCard = (courseObj, query) => {
  console.log(courseObj, query);
  return (
    courseObj.title.toLowerCase().includes(query.toLowerCase()) ||
    courseObj.desc.toLowerCase().includes(query.toLowerCase()) ||
    courseObj.prefix.toLowerCase().includes(query.toLowerCase()) ||
    (!isNaN(parseInt(query, 10)) && courseObj.number === parseInt(query, 10))
  );
};

// const searchButton = document.getElementById("search-btn");
const searchField = document.querySelector('input[name="query-text"]');

searchField.addEventListener("input", (ev) => {
  console.log(ev);
  ev.preventDefault();
  console.log("query text");

  const queryText = searchField.value;
  console.log(queryText);
  // debugger
  filteredCourses = filteredCourseCards = data.items.filter((course) =>
    filterCourseCard(course, queryText)
  );
  filteredCourseCards = filteredCourses.map(courseToCard);
  // console.log("filteredCourseCards", filteredCourseCards);
  resultsContainer.innerHTML = filteredCourseCards.join("");
  updateCount();
});

// 3. we update the result count and related summary info as we filter
function updateCount() {
  const count = document.getElementById("result-count");
  const countValue = filteredCourses.length;
  count.innerText = `${countValue} items`;
}

