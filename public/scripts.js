// for post.html
$(function () {
    let selValues = [];
    let inpValues = [];
    $('#sel').on('change', function () {
        let value = $(this).val();
        console.log('Value', value);
        //value is string
        console.log(typeof (value));


        //make the value chosen from the select tag into array
        let inpArr = value.split(',')
        
        //Concept
        // get the ingredient values in the text area field and compare it to the selected ingredient
        // values.   
        //if the selValues array doesn't have that text area ingredient it would be added to the array.
        //if the text area doesn't have that ingredient in selValues array it would be added to the text 
        //area field.
        let textValue = $('#txt').val();
        console.log('textValuesel', textValue);
        if (textValue === '') {
            console.log('selValues0', selValues);
            
            selValues.push(value);
            console.log('selValues01', selValues);
            $('#txt').val(selValues);
            console.log('selValue1', selValues);
            
        } else {
            console.log('selValues1', selValues);

            
            console.log('textValue2sel', textValue)
            let textSplitArr = textValue.split(',');
            textSplitArr.forEach((value, index) => {
                if (selValues.indexOf(value) === -1) {
                    selValues.push(value);
                }
            })
            console.log('textSplitArrsel', textSplitArr);
            
            console.log(textSplitArr.indexOf(value));
            if (textSplitArr.indexOf(value) === -1) {
                console.log('selValues2', selValues);
                

                selValues.push(value);
                console.log('selValue2', selValues);
                $('#txt').val(selValues);
            }
            




        }
    })
    let c = 0;

    $('#ing-btn').on('click', function (event) {

        event.preventDefault();

        console.log('Here');
        let value = $('#ing').val();
        console.log(typeof (value));
        console.log(value);
        let valArr = value.split(',');
        
        console.log('valArr', valArr);

        $('#ing').val("");

        //Concept
        // get the ingredient values in the text area field and compare it to the input ingredient values 
        // entered by the user.  
        //if the inpValues array doesn't have that text area ingredient it would be added to the array.
        //if the text area doesn't have that ingredient in inpValues array it would be added to the text 
        //area field.
        let textValue = $('#txt').val();
        console.log('textValue1', textValue);
        if (textValue === '') {
            console.log('inpValues0', inpValues);
            
            inpValues.push(value);
            console.log('inpValues01', inpValues);
            $('#txt').val(inpValues);
            console.log('inpValue1', inpValues);
        } else {
            console.log('inpValues1', inpValues);

            
            console.log('textValue2', textValue)
            let textSplitArr = textValue.split(',');
            textSplitArr.forEach((value, index) => {
                if (inpValues.indexOf(value) === -1) {
                    inpValues.push(value);
                }
            })
            console.log('textSplitArr', textSplitArr);
           
            console.log(textSplitArr.indexOf(value));
            if (textSplitArr.indexOf(value) === -1) {
                console.log('inpValues2', inpValues);
                

                inpValues.push(value);
                console.log('inpValue2', inpValues);
                $('#txt').val(inpValues);
            }


            


        }



        

        
        
       


    })
    //clear list
    $('#list-btn').on('click', function (event) {
        event.preventDefault();
        $('#txt').val("");
        selValues = [];
        inpValues = [];
    })
    $.ajax({
        type: "GET",
        url: "/thanks",
        success: function (data) {
            if(data) {
                let myHTML = "";
                $('#sel').empty();
                console.log(data);
                myHTML += "<option selected>Select Menu</option>"
                data.forEach((value, index) => {
                    myHTML += `<option>${value}</option>`
                })
                
                $('#sel').append(myHTML);
            }
            

        },
        error: function (textStatus) {
            console.log(textStatus);
        }
    })
})