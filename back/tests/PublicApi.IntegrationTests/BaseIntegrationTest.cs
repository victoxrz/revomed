namespace PublicApi.IntegrationTests;

public abstract class BaseIntegrationTest : IClassFixture<WebFactory>
{
    protected readonly WebFactory _factory;
    protected readonly HttpClient _client;

    protected BaseIntegrationTest(WebFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }
}
