$(function(){
    function getFood() {
        $.ajax({
            method: 'GET',
            url: '/home',
            success: function(data) {
                let HTML = "";
                $('#tbody').empty();
                data.forEach((item, index)=> {
                    HTML += '<tr>'
                    HTML += `<td>${item.id}</td>`;
                    HTML += `<td>${item.food}</td>`;
                    HTML += `<td><img src="${item.image}" width="30px" height="30px"></td>`;
                    HTML += `<td>${item.user}</td>`
                    HTML += `<td><button class="bg-danger delete" data-id="${item.id}" >Delete</button></td>`
                    HTML+= '</tr>'
                    
                })
                $('#tbody').append(HTML);
            }
        })
    }
    getFood();
    $(document).on('click', '.delete', function(){
       const id = $(this).attr('data-id');
       console.log(id);
       $.ajax({
           method: 'DELETE',
           url: "/food/" + id,
           success: function (data) {
               console.log(data);
               getFood();
           },
           error: function(err) {
               console.log(err);
           }
       })
    })
})