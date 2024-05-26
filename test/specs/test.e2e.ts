describe('My Login application', () => {
  it('Create Session with Flutter Integration Driver', async () => {
    await driver.pause(2000);
    await(await $('#email')).click();
    await driver.pause(20000);
  });
});
