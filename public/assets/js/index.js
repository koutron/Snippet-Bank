let selectedSnippet;
//Update Snippet Functionality
$("#updateSnippet").on("click", function (event) {
    $("#newSnippetArea").hide();
    $("#detailSnippetArea").show();
    $("#detailTitle").val($("#bodyTitle").text());
    $("#detailLanguage").val($("#bodyLanguage").text());
    $("#detailDescription").val($("#bodyDescription").text());
    $("#detailSnippetBody").val($("#bodySnippetBody").text());

    $("#snippetCard").hide(
        function () {

            $("#saveUpdatedSnippet").show()
            $("#submitSnippet").hide()

        }
    );
});

// Event handler for 
$("#saveUpdatedSnippet").on("click", function (event) {
    event.preventDefault();


    var snippetData = {
        id: $("#bodyID").text(),
        title: $("#detailTitle").val(),
        body: $("#detailSnippetBody").val(),
        language: $("#detailLanguage").val(),
        description: $("#detailDescription").val(),
    }

    $.ajax("/api/updates/", {
        type: "POST",
        data: snippetData
    }).done(
        location.reload("/")
    )


})


// Event handler for "Add New Snippet" button click
$("#addSnippet").on("click", function (event) {
    event.preventDefault();
    // Show the form for adding a character
    $("#newSnippetArea").show();
    $("#detailSnippetArea").hide();
    $("#snippetCard").hide();
});

$("li").on("click", function (event) {


    $("#snippetCard").show();
    $("#newSnippetArea").hide();
    const id = $(this).val();
    $.ajax({
        url: "api/" + id,
        method: "POST"
        //Send user back to homepage for refresh
    }).then(function (data) {

        $("#bodyID").text(data[0].id);
        $("#bodyTitle").text(data[0].snippetTitle);
        $("#bodySnippetBody").text(data[0].snippetBody);
        $("#bodyLanguage").text(data[0].language);
        $("#bodyDescription").text(data[0].description);
        $('pre > code').each(function () {
            hljs.highlightBlock(this);
        });



    });

});




//Event handler for the main dropdown
$(".ddLanguage").on("click", function (event) {
    //Sets the dropdown title to reflect the currently selected option
    $("#mainFilterTitle").text($(this).text())
    //if the option is all then make a seperate select all query
    if ($(this).text() === "All") {
        //then use functions.SelectAll
    }
    //or else condtionally select from the database
    app.get("/", async (req, res) => {
        const data = await functions.selectWhereEqual(connection, "snippets", "language", $(this).text())
        res.render("index", { snippets: data });
    });
})

//Event handler for creationdate drop down
$(".ddCreationDate").on("click", function (event) {
    //if the filter is currently set to all then use a selectAll query
    if ($("#mainFilterTitle").text() === "All") {
        //then use 
        app.get("/", async (req, res) => {
            const data = await functions.SelectAllOrder(connection, "snippets", "id", $(this).attr('id'))
            res.render("index", { snippets: data });
        });
    }
    //if the filter is not set to all then use a more selective query
    app.get("/", async (req, res) => {
        //Sorts by id in the table, where the actual HTML element supplies the asc or desc in the element id
        const data = await functions.selectWhereEqualOrderAsc(connection, "snippets", "language", $("#mainFilterTitle").text(), "id", $(this).attr('id'))
        res.render("index", { snippets: data });
    });
})