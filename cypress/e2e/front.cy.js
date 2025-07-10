describe('Acesso ao site', () => {
  beforeEach(() => {
    
    cy.visit('/view/login.html')
  })


  it.only('Verificação de acesso', () => {
    cy.title().should('be.equal', 'Help Desk - Login')
  })
    
  it.only('Login', () => {
    cy.get('a').click()
    cy.get('[for="name"] > input').type('Teste')
    cy.get('[for="email"] > input').type('teste@teste.com')
    cy.get('#password').type('senha')
    cy.get('button').click()
    cy.get('a').click()
    cy.get('input[type="email"]').type('teste@teste.com')
    cy.get('input[type="password"]').type('senha')
    cy.get('button').click()
  })

  it.only('Criação de Usuário', () =>{
    cy.get('#addButton').click()
    cy.get('#name').type('Gustavo Machado')
    cy.get('#email').type('gustavo@machado.com')
    cy.get('#modal-button').click()
  })

  it.only('Alteração de Usuário', () => {
    cy.get(':nth-child(5) > #action-5 > [onclick="triggerModalEdit(5)"]').click()
  })


  after(() => {
  const path = '../helpdesk-page/data/loggedIn.json';

  cy.task('deleteFileIfExists', path).then((deleted) => {
    if (deleted) {
      cy.log(`Arquivo ${path} deletado`);
    } else {
      cy.log(`Arquivo ${path} não encontrado`);
    }
  });
});

})