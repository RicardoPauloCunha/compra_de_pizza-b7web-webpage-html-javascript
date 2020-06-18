const q = (query) => document.querySelector(query);
const qa = (query) => document.querySelectorAll(query);

let modalQt = 1;
let cart = [];
let modalKey = 0;

// Listagem da pizzas
pizzaJson.map((item, index) => {
    // Recupara os elementos da pizza e clona
    let pizzaItem = q('.models .pizza-item').cloneNode(true);

    // Seta um atributo de identificacao
    pizzaItem.setAttribute('data_key', index);

    // Adiciona a imagem
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    // Adicionar pizza
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        e.preventDefault();

        // Recupera a kye procurando o item mais proxima
        let key = e.target.closest(".pizza-item").getAttribute('data_key');

        // Reseta quantidade
        modalQt = 1;

        // Indica qual pizza
        modalKey = key;

        // Preenche os dados do modal
        q(".pizzaBig img").src = pizzaJson[key].img;
        q(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
        q(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        q(".pizzaInfo--actualPrice").innerHTML = `R$ ${item.price.toFixed(2)}`;

        // Desmarca o tamanho
        q(".pizzaInfo--size.selected").classList.remove("selected");

        // Preenche os tamanhos
        qa(".pizzaInfo--size").forEach((size, sizeIndex) => {
            // Marca a opção de tamanho grande
            if (sizeIndex === 2)
                size.classList.add("selected");

            // Preenche os tamanos
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        q('.pizzaInfo--qt').innerHTML = modalQt;

        // Adiciona efeitos
        q('.pizzaWindowArea').style.opacity = 0;

        // Abre o modal
        q('.pizzaWindowArea').style.display = 'flex';

        // Adiciona efeitos
        setTimeout(() => {
            q('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    // Adiciona as informações do pizza
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    // Adiciona na lista de pizzas
    q(".pizza-area").append(pizzaItem);
});

// Eventos do modal
function closeModal() {
    // Adiciona efeitos
    q('.pizzaWindowArea').style.opacity = 0;

    // Espera para mudar o estilo
    setTimeout(() => {
        // Fechar o modal
        q('.pizzaWindowArea').style.display = 'none';
    }, 500);
};

// Fecha o modal
qa(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) => {
    item.addEventListener("click", closeModal);
});

// Diminui o qtd
q(".pizzaInfo--qtmenos").addEventListener("click", () => {
    // Caso igual a 1 fecha o modal
    if (modalQt > 1) {
        modalQt--;
        q('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

// Aumenta a qtd
q(".pizzaInfo--qtmais").addEventListener("click", () => {
    modalQt++;
    q('.pizzaInfo--qt').innerHTML = modalQt;
});

// Seleciona o tamanho
qa(".pizzaInfo--size").forEach((size, sizeIndex) => {
    size.addEventListener("click", (e) => {
        // Desmarca o tamanho
        q(".pizzaInfo--size.selected").classList.remove("selected");

        // Marca ele
        size.classList.add('selected');
    });
});

// Adicionar ao carrinho
q(".pizzaInfo--addButton").addEventListener("click", () => {
    // Pega o tamanho seleciondado
    let size = parseInt(q(".pizzaInfo--size.selected").getAttribute("data-key"));

    // Adiciona um identificador para a pizza e o tamanho
    let identifier = pizzaJson[modalKey].id + "@" + size;

    // Verifica se tem um item no carrinho com o mesmo identificador
    let key = cart.findIndex((item) => item.identifier == identifier);

    // Caso encontre
    if (key > -1) {
        // Adiciona a quantidade
        cart[key].qt += modalQt;
    }
    else {
        // Adiciona no carrinho
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt,
            price: pizzaJson[modalKey].price
        });
    }

    updateCart();
    closeModal();
});

q(".menu-openner").addEventListener("click", () => {
    if (cart.length > 0) {
        q('aside').style.left = "0";
    }
});

q(".menu-closer").addEventListener("click", () => {
    q('aside').style.left = "100vw";
});

// Atualiza o carrinho
function updateCart() {
    q(".menu-openner").innerHTML = cart.length;

    if (cart.length > 0) {
        // Abre o carrinho
        q('aside').classList.add('show');

        // Reseta a lista
        q(".cart").innerHTML = '';

        // Variaveis de controle
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        // Para cada item
        cart.map((item, index) => {
            // Soma os valores
            subtotal += item.price * item.qt;

            // Recupera a pizza
            let pizzaItem = pizzaJson.find(x => x.id == item.id);

            // Pega o carrinho
            let cartItem = q(".models .cart--item").cloneNode(true);

            // Formata o tamanho
            let pizzaSizeName;

            switch (item.size) {
                case 0:
                    pizzaSizeName = "P";
                    break;

                case 1:
                    pizzaSizeName = "M";
                    break;

                case 2:
                    pizzaSizeName = "G";
                    break;
            }

            // Formata o nome
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            // Adiciona os atributos
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = item.qt;

            // Define ações dos botoes
            cartItem.querySelector('.cart--item-qtmenos').addEventListener("click", () => {
                // Caso ainda tenha alguma pizza
                if (item.qt > 1) {
                    item.qt--;
                }
                // caso não tenha nenhum
                else {
                    cart.splice(index, 1);
                }

                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener("click", () => {
                item.qt++;
                updateCart();
            });

            // Adiciona na lista
            q(".cart").append(cartItem);
        });

        // Calcula os outros valores
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        q(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
        q(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
        q(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        q('aside').classList.remove('show');
        q('aside').style.left = "100vw";
    }
};