//pokedex v1

const pokelist = document.getElementById('pokedex');
const apiUrl = 'https://pokeapi.co/api/v2';

let pokemoness = [];

const typeColors = {
    normal:'#A8A878',
    fighting:'#C02038',
    flying:'#A890F0',
    poison:'#A040A0',
    ground:'#E0C068',
    rock:'#B8A038',
    bug:'#A8B820',
    ghost:'#705898',
    steel:'#B8B8D0',
    fire:'#F08030',
    water:'#6890F0',
    grass:'#78C850',
    electric: '#F8D030',
    psychic:'#F75887',
    ice:'#98D8D8',
    dragon:'#7038F8',
    dark:'#705848',
    fairy:'#EE99AC',
    unknown:'#595959',
    shadow:'#262626',
}

const getPokemons = async () => {

    const count = 150
    try{
        for(let i = 1; i <= count; i++) {
            const pokemonsReq = await fetch(`${apiUrl}/pokemon/${i}`);
            const json = await pokemonsReq.json();  
            pokemoness.push(json);
        }

        Promise.all(pokemoness).then((values) => {
            
            drawPokeList(values);
            //search functionality
            const searchInput = document.querySelector('.container__search--input');
        
            let timeout = null;
        
            searchInput.addEventListener('input', function (e) {
                clearTimeout(timeout);
        
                timeout = setTimeout(function () {
                    if(e.target.value === '') {
                        drawPokeList(pokemoness);
                        document.body.style.background = '#673ab7';
                    } else {
                        const result = findPokemon(pokemoness, e.target.value);
                        const type = result[0]?.types[0].type.name || "unknown";
                        document.body.style.background = typeColors[type];
                        drawPokeList(result);
                        
                    }
                }, 1000);
            });
        
            const clearTypeBtn = document.querySelector('.clear-type');
            clearTypeBtn.addEventListener('click', () => {
                document.body.style.background = '#673ab7';
                document.querySelectorAll('.tipo').forEach( elem => elem.classList.remove('active'));
                searchInput.value = '';
                drawPokeList(pokemoness);
            
            })
        
            const findBtn = document.querySelector('.container__search--btn');
            findBtn.addEventListener('click', () => {
                if(searchInput.value) {
                    const result = findPokemon(pokemoness, searchInput.value);
                    drawPokeList(result);
                }
            });
        
        });

        const loading = document.querySelector('.container__loading');
        loading.remove();

    } catch(err) {
        console.log(`Ha habido un error: ${err}`);
    }
}
getPokemons();



const getPokemonTypes = async () => {
    
    try{
        const typelist = await await fetch(`${apiUrl}/type`);
        const json = await typelist.json();
        const poketypes = json.results;

        drawFilterType(poketypes);
    } catch(err) {
        console.log(err);
    }
}

getPokemonTypes();

function findPokemon (pokemons, value) {
    let cleanpokes = pokemons.filter( pokemon => pokemon.name.includes(value.toLowerCase()) || pokemon.id == value);
                
    if(cleanpokes.length > 0) {
        const foundPokemon = new Audio('./sounds/found-pokemon.mp3');
        foundPokemon.play();
    } 
    return cleanpokes;
}


function drawPokeList (pokeArray) {
    //clean list
    document.querySelectorAll('.container__li').forEach( elem => elem.remove());
    let exist = document.querySelector('.container__search--p');
    if(pokeArray.length == 0) {
        
        if(exist) {
            exist.remove();
        }
        
        const searchDiv = document.querySelector('.container__search');
        const createP = document.createElement('p');
        createP.classList.add('container__search--p');
        createP.innerHTML = 'No se han encontrado pokemons que concuerden con el criterio de busqueda.';
        searchDiv.appendChild(createP);
        const notfoundPokemon = new Audio('./sounds/notFound.mp3');
        notfoundPokemon.play();
    } else {
        if(exist) {
            exist.remove();
        }
    }

    //draw list
    for(let pokemon of pokeArray) {
        const pokeElement = document.createElement('li');
        pokeElement.classList.add('container__li');
        pokeElement.innerHTML = `
        <img class="container__img" src="${pokemon.sprites['front_default']}" alrt="${pokemon.name}"> 
        <h3 class="container__h3">${pokemon.name}</h3>
        <span class="container__span">ID: ${pokemon.id}</span>
        <div class="container__smallwrap">
        ${
            pokemon.types.map((type) => '<small style="background:'+ typeColors[type.type.name] +'" class="container__small">' + type.type.name + '</small>')
        }</div>`;
    
        pokelist.appendChild(pokeElement);
        
    
    } 
}


function drawFilterType(pokeTypesArray) {
//draw type filters
    pokeTypesArray.forEach( type => {
        const filterWrap = document.querySelector('.container__search--typefilter');
        const filter = document.createElement('div');
        filter.classList.add('tipo');
        filter.innerHTML = type.name;
        const clearBtn = document.querySelector('.clear-type');
        filterWrap.insertBefore(filter, clearBtn);
        filter.style.background = typeColors[type.name];
        
        filter.addEventListener('click', (e) => {
            document.body.style.background = typeColors[type.name];
            document.querySelectorAll('.tipo').forEach( elem => elem.classList.remove('active'));
            e.target.classList.add('active');
            let cleanpokes = pokemoness.filter( pokemon => {
                if(pokemon.types.map( elem => elem.type.name).includes(e.target.innerText)) {
                    return pokemon
                }
            });
            drawPokeList(cleanpokes);
        });

        });

}

