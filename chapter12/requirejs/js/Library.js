define(["./Book"], function(book) {

        return {
            name: "My Library",
            getContents: function() {
                var books = []; 
                books.push(book); 
                return books;
            }
        }
    }
);