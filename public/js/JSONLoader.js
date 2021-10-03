//Custom JSON loader used to fetch the icons / quizz / etc... data


//Path : path to access the json file from the current repertory.
//Success : function that takes the successful json object constructed from parsing as an argument
//Error : function that takes the error string as an argument
export const loadJSON = (path, success, error) => {
    
    //Building the Http Request
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function()
    {
        //Once the request is completed
        if (xhr.readyState === XMLHttpRequest.DONE) {
            //In case of success, execute the success method
            if (xhr.status === 200) {
                if (success) {
                    success(JSON.parse(xhr.responseText));
                }
            } 
            //In case of failure, execute the error method
            else {
                if (error) {
                    error(xhr);
                }
            }
        }
    };
    
    xhr.open("GET", path, true);
    xhr.send();
}