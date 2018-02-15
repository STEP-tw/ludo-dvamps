describe('Ludo game', () => {
  describe('opening game site', () => {
    it('should get the landing page', () => {
      cy.visit('localhost:8000/');
      cy.title().should('include','Ludo');
      // cy.get('')
    });
  });
});
