import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row(props) {

    const [movies, setMovies] = useState([]);
    const [trailerPath, setTrailerPath] = useState('');
    

    useEffect(() => {
        const fetchData = async () => {
            const request = await axios.get(props.fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [props.fetchUrl])

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            modestbranding: 1,
            controls: 0,
        },
    };

    const handleClick = (movie) => {
        if (trailerPath === '') {
            movieTrailer(movie?.name || movie?.title || movie?.original_name || movie?.original_title).then((response) => {
                const path = response.split('?v=')[1];
                setTrailerPath(path);
                document.querySelector('body').style.overflow = 'hidden';
                
            }).catch((error) => {
                handleError();
                console.log(error);
            })
        } else {
            setTrailerPath('');
            
            document.querySelector('body').style.overflow = 'auto';
        }
    }

    return (
        <div className="row__container">
            <h2 className="row__title">{props.title}</h2>
            <div className="row">
                <div className={`row__posters row__posters--${props.id}`}>
                    {movies.map((movie) => {
                        return <img key={movie.id} className="row__poster" src={base_url + movie.backdrop_path} alt={movie.name} onClick={() => handleClick(movie)} />
                    })}
                </div>
                {trailerPath && <div className="info__overlay" onClick={() => handleClick(null)}>
                    <YouTube videoId={trailerPath} opts={opts} />
                </div>
                }
            </div>
        </div>
    )
}

export const handleError = function () {
    const html = `
    <div class="error">
        <div class="error__text">
            <p class="error__heading">Error:</p>
            <p class="error__description">Can't find trailer, please try another title!</p>
        </div>
    </div>
    `
    const body = document.querySelector('body');
    body.insertAdjacentHTML('afterbegin', html);
    const error = body.querySelector('.error');
    error.classList.add('fade-in');

    setTimeout(function () {
        // error.classList.remove('fade-in');
        error.classList.add('fade-out');
        setTimeout(function () {
            error.remove();
        }, 500)
    }, 2500)
}

export default Row;