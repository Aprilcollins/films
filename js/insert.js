$(
    $("#film-insert-form").submit(function(event) {
        event.preventDefault();
        const requestData = convertFormToJSON( $(this).serializeArray())
        $.ajax({
            url: FILMS_API_URL,
            method: 'POST',
            dataType: dataTypeDictionary[getContentType()],
            headers: getRequestHeader(),
            data: serializeRequest(requestData),
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
