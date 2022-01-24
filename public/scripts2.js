// for index.html
$(function () {
  
  
  
  getRecipe();






  


  // getRecipe();

  function getRecipe() {
   
    $.ajax({
      type: "GET",
      url: "/home",
      success: function (data) {
        if (data) {
          let HTML = "";
          $('#recipes').empty();
          
          // alert(JSON.stringify(data));
         
          data.forEach((item, index) => {
            HTML += `<figure>
              <img src= ${item.image} alt=${item.altName} style="width:100%;height:250px;object-fit: cover">
              <figcaption><h3 class="fontRes" style="font-family: 'Times New Roman', serif;"><span>${item.food}</span></h3></figcaption>
            </figure>`;

            HTML += '<div class="text-left">'
            HTML += `<label style="font-family: Comic Sans MS, Comic Sans, cursive" class="d-block"> 
              <span class="bg-danger text-white" style="border: 1px solid black; border-radius:25px; padding: 10px;">ingredients </span></label>`
            //   card deck section
            HTML += '<div class="card-deck mt-3">'
            HTML += '<div class="d-inline-flex justify-content-start flex-wrap">'
            item.ingredients.forEach((value, index) => {
              HTML += '<div>'

              HTML += '<div class="card bg-primary" style="border-radius:50%">'
              HTML += '<div class="card-body text-center text-white">'

              HTML += `<p class="card-text">${value}</p>`
              HTML += '</div>'
              HTML += '</div>'
              HTML += '</div>'
              

            })
            HTML += '</div>'
            HTML += '</div>'
            HTML += '<hr>'
            //   end of card deck section
            HTML += `<p class="mt-4"style="font-family: Comic Sans MS, Comic Sans, cursive;text-align: left;"><span class="bg-info text-white" style="border: 1px solid black; border-radius:25px; padding: 10px;">instructions</span></p>`
            HTML += `<textarea disabled class="form-control" style="font-family: Comic Sans MS, Comic Sans, cursive;text-align:justify;text-align-last: left;overflow: auto"rows="5">${item.instruction}</textarea>`
            HTML += `<p class="mt-5"><b style="font-family: Comic Sans MS, Comic Sans, cursive">Created by:</b> ${item.user}</p>`
            HTML += '</div>'
              HTML += '</div>'
          })
          $('#recipes').append(HTML);
        }

      },
      error: function (textStatus) {
        console.log(textStatus);
      }

    })
  }

})