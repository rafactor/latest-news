console.log("start")
var $scrape = $('#btn-request-news')
var $institution = $('#institution-input')

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

      getNews: function(body){
        return $.ajax({
          url: "/articles",
          type: "GET"
        });
      }
}

var refresh = {
  articles(){
    API.getNews().then(function(data){
      let n = data.count
      console.log(data.articles[0].title)

      var $ul = $(".news-list")

      for (i = 0; i < n; i++){
        var $item = $("<li>")
        .html(`
        <div class="media-body">
        <h5 class="mt-0 mb-1"><a href='#'>
          ${data.articles[i].title}
          </a></h5>
          ${data.articles[i].summary}
          </div>
          `)
         

        $ul.append($item)
      }


    })
  }
}

var handle = {
    newsScraping(){
        event.preventDefault();

        var institution = $institution.val()

        var body = {
          category: institution,
          startDate: "",
          endDate: "",
          index: 0
        }

        API.scrapeNews(body).then(function(){
          refresh.articles()
        })
      },

      getArticles(){
        event.preventDefault();

        API.getNews().then('done2')
      }
}

$scrape.on("click", handle.newsScraping)
// $scrape.on("click", handle.getArticles)