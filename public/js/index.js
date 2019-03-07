console.log("start");

// Search Component
const $institution = $("#institution-input");
const $type = $("#type-input");
const $start = $("#startDate");
const $end = $("#endDate");
const $search = $("#search-btn");
const $cancelSearch = $("#search-cancel-btn");


// const $newsList = $(".news-list")
// const btnSave = $(".save-article");
// const linkViewArticles = $("#viewed-articles")
// const linkLatestArticles = $("#latest-articles")
// const newsContainer = $(".news-list")
// const pageHeader = $('.page-header')
// const pageHeaderTotals = $('.page-header-totals')

// Date Picker
var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
$('#startDate').datepicker({
    uiLibrary: 'bootstrap4',
    iconsLibrary: 'fontawesome',
    minDate: function () {
      return $('#endDate').val();
    },
    maxDate: today,
});
$('#endDate').datepicker({
    uiLibrary: 'bootstrap4',
    iconsLibrary: 'fontawesome',
    maxDate: today,
    minDate: function () {
        return $('#startDate').val();
    }
});


var API = {
  scrapeNews: function(body) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/articles",
      data: JSON.stringify(body)
    });
  },

  // getNews: function(body) {
  //   return $.ajax({
  //     url: "/articles",
  //     type: "GET"
  //   });
  // },

  // viewArticles: function(id) {
  //   return $.ajax({
  //     type: "GEt",
  //     url: "/articles/" + id
  //   });
  // },

  // viewAllArticles: function(id) {
  //   return $.ajax({
  //     type: "GEt",
  //     url: "/articles/view"
  //   });
  // },
};

// var refresh = {
  // latestArticles(updated) {
  //   API.getNews().then(function(data){
  //     let n = data.count;
  //     let updated = moment().format('LLLL');  

  //     pageHeader.html("Latest News")
  //     pageHeaderTotals.text(updated)

  //     // newsContainer.empty()

  //     for (i = 0; i < n; i++) {
  //       let date = data.articles[i].date
  //       let dateHeader = date.slice(0,10)

  //       var $item = $("<li>").html(`
  //       <div class="media mt-3">
        

  //       <div class="media-body">
  //       <h5 class="mt-0 mb-1"><a href=${data.articles[i].url} class="link" data-id=${data.articles[i]._id} target="_blank">
  //         ${data.articles[i].title}
  //         </a>
  //         <span class="badge badge-secondary">New</span></h5>
  //         <p class="sub-header">
  //         ${dateHeader} |  ${data.articles[i].department} | ${data.articles[i].type}
  //         </p>
  //         <p class="summary">
  //         ${data.articles[i].summary} 
  //         </p>
  //         </div>
  //         <hr>
  //         <h4><a href="#"><i class="far fa-heart save-article" data-id=${data.articles[i]._id}></i></a><h4>
  //         `);

  //         newsContainer.append($item);
  //     }
  //   });
  // },

//   viewedArticles() {
//     API.getNews().then(function(data){
//       let n = data.count;
//       pageHeader.html("Viewed News")


//       newsContainer.empty()

//       for (i = 0; i < n; i++) {
//         let date = data.articles[i].date
//         let dateHeader = date.slice(0,10)

//         var $item = $("<li>").html(`
//         <div class="media mt-3">
        

//         <div class="media-body">
//         <h5 class="mt-0 mb-1"><a href=${data.articles[i].url} class="link" data-id=${data.articles[i]._id} target="_blank">
//           ${data.articles[0].title}
//           </a>
//           <span class="badge badge-secondary">New</span></h5>
//           <p class="sub-header">
//           ${dateHeader} |  ${data.articles[i].department} | ${data.articles[i].type}
//           </p>
//           <p class="summary">
//           ${data.articles[i].summary} 
//           </p>
//           </div>
//           <hr>
//           <h4><a href="#"><i class="far fa-heart save-article" data-id=${data.articles[i]._id}></i></a><h4>
//           `);

//           newsContainer.append($item);
//       }
//     });
//   }
 
// };

var handle = {
  search() {
    event.preventDefault();

    var body = {
      source: "canada",
      category: $institution.val(),
      type: $type.val(),
      startDate: ($start.val() !== "") ? $start.val().replace(/\//g,"-") : "",
      endDate: ($end.val() !== "") ? $end.val().replace(/\//g,"-") : "",
      index: 0
    };

    console.log(body)

    API.scrapeNews(body).then(data)

    // .then(function() {
      // refresh.latestArticles();
    // });
  },

  // saveArticles() {
  //   // event.preventDefault();
   
  //   var target = $(event.target)
   
  //   var saveArticle = target.hasClass("save-article")
  //   var viewArticle = target.hasClass("link")
  //   let id = target.attr("data-id")

  //   if (saveArticle) {
  //     let id = target.attr("data-id")
  //     console.log('save')
  //     // API.saveArticles(id).then(
  //     //   console.log('done')
  //     // )
  //   }

  //   if (viewArticle) {

  //     API.viewArticles(id)
  //   }
  // },

  // viewedArticles(){
  //   event.preventDefault();

  //   $(".news-list").empty();

  //   API.viewAllArticles().then(data=>{

  //     refresh.viewedArticles(data)
  //   })
  // },


};

$search.on("click", handle.search)

// $($newsList).on("click" , btnSave,  handle.saveArticles)

// $(linkViewArticles).on("click", handle.viewedArticles)
// $(linkLatestArticles).on("click", handle.newsScraping)


