import { GithubUser } from "./GithubUser.js";

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root);

        this.load();
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@gitfavs:')) || [];
    }

    save(){
        localStorage.setItem('@gitfavs:', JSON.stringify(this.entries));
    }

    
    async add(username){
        try{
            const userExists = this.entries.find(entry=>entry.login===username);

            if(userExists){
                throw new Error('Esse usuário já existe na tabela');
            }

            const user = await GithubUser.search(username);


            if(user.login === undefined){
                throw new Error('Usuario não encontrado (  ._.)');
            }

            this.entries = [user, ...this.entries];

            console.log(user);
          
            this.update();
            this.save();

        }catch(error){

            alert(error.message);
        }
    }

    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login);
 
         this.entries = filteredEntries;
         this.update();
         this.save();
     }
    
}

export class FavoritesView extends Favorites{
    constructor(root){
        super(root);  
        
        this.tbody = this.root.querySelector('table tbody');

        this.update(); 
        this.addFavorite();   
    }

    addFavorite(){
        const addButton = document.querySelector('.search button');

        addButton.addEventListener('click', ()=>{
            const { value }  = this.root.querySelector('.search input');

            this.add(value);
  
            this.root.querySelector('.search input').value = '';
        });
    }


    update(){
        this.removeRows();

        this.entries.forEach(user=>{
           const row = this.createRows();

           row.querySelector('.user img').src = `https://github.com/${user.login}.png`;

           row.querySelector('.user img').alt = `Imagem de ${user.name}`;

           row.querySelector('.user p').textContent = user.name;

           row.querySelector('.user a').href = `https://github.com/${user.login}`;

           row.querySelector('.user span').textContent = user.login;

           row.querySelector('.repositories').textContent = user.public_repos;

           row.querySelector('.followers').textContent = user.followers;

           this.tbody.append(row);
        });
    
    }

    createRows(){
        const row = document.createElement('tr');

        row.innerHTML = `
        <tr>
        <td class="user">
                <img src="https://github.com/caiofiszuk.png">

                <a href="https://github.com/caiofiszuk" target="_blank">
                <p>Caio Fiszuk</p>
                <span>/caiofiszuk</span>
            </a>
        </td>
        <td class="repositories">123</td>
        <td class="followers ">1234</td>
        <td> <button class="remove">Remover</button></td>
        </tr>
        `;

        return row;
    }

    removeRows(){
        this.tbody.querySelectorAll('tr').forEach((row)=>row.remove());
    }
}