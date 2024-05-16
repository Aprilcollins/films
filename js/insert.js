$(
    $("#film-insert-form").submit(function(event) {
        event.preventDefault();
        const requestData = convertFormToJSON( $(this).serializeArray())
        $.ajax({
            url: FILMS_API_URL,
            method: 'POST',
            dataType: CONTENT_TYPE_MAP[getContentTypeFromSessionStorage()],
            headers: getRequestHeaders(),
            data: serializeRequestData(requestData),
            success: onSuccessFilmUpload,
            error: (xhr, status, error) => {
                console.error(error);
            }
        });
    })
)

const onSuccessFilmUpload = (data) => {
    alert(`Film created successfuly`)
    window.location.href="../films.html"
}
