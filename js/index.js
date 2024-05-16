// Function to display films data
const displayFilms = (data) => {
    const films = deserializeFilmListResponse(data);
    addFilmRowsToTable(films);
    setUpPagination(films);
};

// Function to construct film rows and add them to the table
const addFilmRowsToTable = (films) => {
    const filmsTableRows = films.data.map(film => createFilmRow(film)).join('');
    $('#tbody-film-body').html(filmsTableRows);
};

// Function to create a single film row HTML
const createFilmRow = (film) => {
    return `<tr>
                <td>${film.title}</td>
                <td>${film.director}</td>
                <td>${film.stars}</td>
                <td>${film.year}</td>
                <td>${film.review}</td>
                <td>
                    <div class="btn-group" role="group">
                        <a href="films-update.html?id=${film.id}" class="btn btn-warning">
                            <i class="fa-solid fa-pen"></i><span>Update</span>
                        </a>
                    </div>
                </td>
                <td>
                    <button class="delete-film-button btn btn-danger" type="button" data-id="${film.id}">
                        <i class="fa-solid fa-trash-can"></i>
                        <span>Delete</span>
                    </button>
                </td>
            </tr>`;
};

// Function to set up pagination elements
const setUpPagination = (films) => {
    $('#total-films').text(films.dataCount);
    $('#total-pages').text(films.totalPages);
    $('#current-page').text(films.pageNo);
    $('#current-page-size').text(films.pageSize);

    // Pagination button click handlers
    $('#first-page').click(() => goToPage(1));
    $('#prev-page').click(() => goToPage(Number(films.pageNo) - 1));
    $('#next-page').click(() => goToPage(Number(films.pageNo) + 1));
    $('#last-page').click(() => goToPage(Number(films.totalPages)));
};

// Function to navigate to a specific page
const goToPage = (pageNumber) => {
    window.location.href = `films.html?page-no=${pageNumber}&page-size=15`;
};

// Function to extract and sort URL parameters
const sortUrlParams = () => {
    
    return {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchString: searchString
    };
};

$(document).ready(function(){
    const pageNumber = getURLQueryParam('page-no') || 1;
    const pageSize = getURLQueryParam('page-size') || 15;
    const searchString = getURLQueryParam('search');
    let requestUrl = `${FILMS_API_URL}?page-no=${pageNumber}&page-size=${pageSize}`;
    if (searchString) {
        requestUrl += `&search=${searchString}`;
        $('#search-input').val(searchString);
    }
    $.ajax({
        url: requestUrl,
        method: 'GET',
        dataType: CONTENT_TYPE_MAP[getContentTypeFromSessionStorage()],
        headers: getRequestHeaders(),
        success: displayFilms,
        error: (xhr, status, error) => {
            console.error(error);
        }
    });

    // Delete film
    $('#tbody-film-body').on('click', '.delete-film-button', function() {
        if (confirm('Are you sure you want to delete film?')) {
            const id = $(this).data('id');
            $.ajax({
                url: `${FILMS_API_URL}?id=${id}`,
                type: 'DELETE',
                success: onFilmDelete,
                error: (xhr, status, error) => {
                    console.error(error);
                }
            });     
        }
    });

    // Search films 
    $('#search-film-form').submit(function(event){
        event.preventDefault();
        const search = $('#search-input').val(); 
        window.location.href = `../films.html?search=${search}`;
    });
});

const onFilmDelete = (data) => {
    alert(`Film deleted successfuly`)
    window.location.href="../films.html"
}
