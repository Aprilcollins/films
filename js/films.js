// const FILMS_API_URL = 'http://localhost:8080/Collins-film-project-mvc/films';
const FILMS_API_URL = 'http://collins-coco-env.eba-widchcwm.eu-north-1.elasticbeanstalk.com/films';
const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_XML = 'application/xml';
const CONTENT_TYPE_TEXT = 'text/plain';

const CONTENT_TYPE_MAP = {
    'application/json': 'json',
    'application/xml': 'xml',
    'text/plain': 'text'
};

$(document).ready(function () {
    const userContentType = getContentTypeFromSessionStorage();
    if (userContentType) {
        $('#content-type-select').val(userContentType);
    }

    $('#content-type-select').change(function () {
        const contentTypeOption = $(this).val();
        saveContentTypeToSessionStorage(contentTypeOption);
    });
});


const handleFilmDeletion = (data) => {
    alert('Film deleted!');
    window.location.href = './films.html';
};

const saveContentTypeToSessionStorage = (value) => {
    sessionStorage.setItem('content-type', value);
};

const getContentTypeFromSessionStorage = () => {
    let contentType = sessionStorage.getItem('content-type');
    if (!contentType) {
        saveContentTypeToSessionStorage(CONTENT_TYPE_JSON);
        contentType = CONTENT_TYPE_JSON;
    }
    return contentType;
};

const getRequestHeaders = () => {
    const contentType = getContentTypeFromSessionStorage();
    return {
        'Accept': contentType,
        'Content-Type': contentType
    };
};

const getURLQueryParam = (paramKey) => new URLSearchParams(window.location.search).get(paramKey);

// TEXT
const parseFilmFromText = (filmText) => {
    if (filmText === 'EOF') {
        return;
    }
    const filmData = filmText.split(':::');
    return {
        id: filmData[0],
        title: filmData[1],
        year: filmData[2],
        director: filmData[3],
        review: filmData[4],
        stars: filmData[5]
    };
};

const convertFilmToText = (formData) => {
    let id = 0;
    if (formData.id) {
        id = formData.id;
    }
    const DELIMITER = ':::';
    return `${id}${DELIMITER}${formData.title}${DELIMITER}${formData.year}${DELIMITER}${formData.director}${DELIMITER}${formData.stars}${DELIMITER}${formData.review}`;
};

const parseFilmsFromText = (filmsText) => {
    const filmLines = filmsText.split('\n');
    const paginationInfo = filmLines[0].split(':::');
    const films = [];
    for (let i = 1; i < filmLines.length; i++) {
        const film = parseFilmFromText(filmLines[i]);
        if (film) {
            films.push(film);
        }
    }
    return {
        pageNo: paginationInfo[0],
        pageSize: paginationInfo[1],
        totalPages: paginationInfo[2],
        dataCount: paginationInfo[3],
        data: films
    };
};

// XML
const convertFilmToXml = (formData) => {
    try {
        const xmlDoc = document.implementation.createDocument(null, 'filmDTO');
        for (let key of Object.keys(formData)) {
            const element = xmlDoc.createElement(key);
            element.textContent = formData[key];
            xmlDoc.documentElement.appendChild(element);
        }
        return new XMLSerializer().serializeToString(xmlDoc);
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
};

const parseFilmFromXml = (film) => {
    const id = film.querySelector('id').textContent;
    const title = film.querySelector('title').textContent;
    const director = film.querySelector('director').textContent;
    const review = film.querySelector('review').textContent;
    const stars = film.querySelector('stars').textContent;
    const year = film.querySelector('year').textContent;
    return {
        id: id,
        title: title,
        director: director,
        review: review,
        stars: stars,
        year: year
    };
};

const parseFilmsFromXml = (films) => {
    const filmNodes = films.getElementsByTagName('Film');
    const filmArray = [];
    for (let i = 0; i < filmNodes.length; i++) {
        filmArray.push(parseFilmFromXml(filmNodes[i]));
    }
    return {
        pageSize: films.querySelector('pageSize').textContent,
        pageNo: films.querySelector('pageNo').textContent,
        totalPages: films.querySelector('totalPages').textContent,
        count: films.querySelector('dataCount').textContent,
        data: filmArray
    };
};

const serializeRequestData = (requestData) => {
    switch (getContentTypeFromSessionStorage()) {
        case CONTENT_TYPE_TEXT:
            return convertFilmToText(requestData);
        case CONTENT_TYPE_XML:
            return convertFilmToXml(requestData);
        default:
            return JSON.stringify(requestData);
    }
};

const deserializeFilmListResponse = (responseData) => {
    const contentType = getContentTypeFromSessionStorage();
    if (contentType === CONTENT_TYPE_XML) {
        return parseFilmsFromXml(responseData.documentElement);
    } else if (contentType === CONTENT_TYPE_TEXT) {
        return parseFilmsFromText(responseData);
    } else {
        return responseData;
    }
};

const deserializeFilmResponse = (responseData) => {
    switch (getContentTypeFromSessionStorage()) {
        case CONTENT_TYPE_TEXT:
            return parseFilmFromText(responseData);
        case CONTENT_TYPE_XML:
            return parseFilmFromXml(responseData.documentElement);
        default:
            return responseData;
    }
};

const convertFormToJSON = (formData) => {
    const requestData = {};
    $.each(formData, function (index, field) {
        requestData[field.name] = field.value;
    });
    return requestData;
};

