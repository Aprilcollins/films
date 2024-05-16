$(function(){
    const idParam = getURLQueryParam('id');

    // Function to handle successful film update
    const handleFilmUpdate = (data) => {
        alert(`Film updated successfully`);
        window.location.href = "../films.html";
    };

    // Function to handle single film request success
    const handleSingleFilmRequest = (filmData) => {
        const film = deserializeFilmListResponse(filmData);
        populateUpdateForm(film);
    };

    // AJAX request to fetch single film data
    $.ajax({
        url: `${FILMS_API_URL}?id=${idParam}`,
        method: 'GET',
        dataType: CONTENT_TYPE_MAP[getContentTypeFromSessionStorage()],
        headers: getRequestHeaders(),
        success: handleSingleFilmRequest,
        error: (xhr, status, error) => {
            console.error(error);
        }
    });

    // Form submission handling for updating film
    $("#update-film-form").submit(function(event) {
        event.preventDefault();
        const requestData = convertFormToJSON($(this).serializeArray());
        
        // AJAX request to update film
        $.ajax({
            url: FILMS_API_URL,
            method: 'PUT',
            dataType: CONTENT_TYPE_MAP[getContentType()],
            headers: getRequestHeaders(),
            data: serializeRequest(requestData),
            success: handleFilmUpdate,
            error: (xhr, status, error) => {
                console.error(error);
            }
        });
    });

    // Function to populate update form with film data
    const populateUpdateForm = (film) => {
        $("#update-film-form input[name='id']").val(film.id);
        $("#update-film-form input[name='title']").val(film.title);
        $("#update-film-form input[name='director']").val(film.director);
        $("#update-film-form input[name='year']").val(film.year);
        $("#update-film-form input[name='stars']").val(film.stars);
        $("#update-film-form textarea[name='review']").val(film.review);  
    };
});
