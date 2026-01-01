using System.Security.Claims;
using System.Text.Encodings.Web;
using AppCore.Interfaces.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using PublicApi.Authentication;

namespace PublicApi.UnitTests.Authentication;

public class SessionAuthenticationHandlerTests
{
    private readonly Mock<ISessionStore> _sessionStoreMock;
    private readonly Mock<IOptionsMonitor<AuthenticationSchemeOptions>> _optionsMock;
    private readonly Mock<ILoggerFactory> _loggerFactoryMock;
    private readonly Mock<UrlEncoder> _encoderMock;
    private readonly SessionAuthenticationHandler _handler;
    private readonly DefaultHttpContext _context;

    public SessionAuthenticationHandlerTests()
    {
        _sessionStoreMock = new Mock<ISessionStore>();
        _optionsMock = new Mock<IOptionsMonitor<AuthenticationSchemeOptions>>();
        _loggerFactoryMock = new Mock<ILoggerFactory>();
        _encoderMock = new Mock<UrlEncoder>();

        _optionsMock.Setup(x => x.Get(It.IsAny<string>())).Returns(new AuthenticationSchemeOptions());

        var logger = new Mock<ILogger<SessionAuthenticationHandler>>();
        _loggerFactoryMock.Setup(x => x.CreateLogger(It.IsAny<string>())).Returns(logger.Object);

        _handler = new SessionAuthenticationHandler(
            _optionsMock.Object,
            _loggerFactoryMock.Object,
            _encoderMock.Object,
            _sessionStoreMock.Object
        );

        _context = new DefaultHttpContext();
    }

    private async Task<AuthenticateResult> RunHandlerAsync()
    {
        await _handler.InitializeAsync(
            new AuthenticationScheme("Session", "Session", typeof(SessionAuthenticationHandler)),
            _context
        );
        return await _handler.AuthenticateAsync();
    }

    [Fact]
    public async Task HandleAuthenticateAsync_NoAuthorizationHeader_ReturnsNoResult()
    {
        // Act
        var result = await RunHandlerAsync();

        // Assert
        Assert.True(result.None);
    }

    [Fact]
    public async Task HandleAuthenticateAsync_EmptySessionId_ReturnsFail()
    {
        // Arrange
        _context.Request.Headers.Authorization = "   ";

        // Act
        var result = await RunHandlerAsync();

        // Assert
        Assert.False(result.Succeeded);
        Assert.Equal("Invalid session ID", result.Failure?.Message);
    }

    [Fact]
    public async Task HandleAuthenticateAsync_SessionNotFound_ReturnsFail()
    {
        // Arrange
        var sessionId = "invalid-session";
        _context.Request.Headers["Authorization"] = sessionId;
        _sessionStoreMock
            .Setup(x => x.GetSessionAsync(sessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((UserSession?)null);

        // Act
        var result = await RunHandlerAsync();

        // Assert
        Assert.False(result.Succeeded);
        Assert.Equal("Session not found or expired", result.Failure?.Message);
    }

    [Fact]
    public async Task HandleAuthenticateAsync_ValidSession_ReturnsSuccess()
    {
        // Arrange
        var sessionId = "valid-session";
        var userSession = new UserSession(
            1,
            "test@example.com",
            "User",
            "Chrome",
            "127.0.0.1",
            DateTime.UtcNow
        );

        _context.Request.Headers.Authorization = sessionId;
        _sessionStoreMock
            .Setup(x => x.GetSessionAsync(sessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(userSession);

        // Act
        var result = await RunHandlerAsync();

        // Assert
        Assert.True(result.Succeeded);
        Assert.NotNull(result.Principal);
        Assert.Equal("test@example.com", result.Principal.FindFirst(ClaimTypes.Email)?.Value);
        Assert.Equal("1", result.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        // Verify session refresh was called
        _sessionStoreMock.Verify(
            x => x.RefreshSessionAsync(sessionId, It.IsAny<CancellationToken>()),
            Times.Once
        );
    }

    [Fact]
    public async Task HandleAuthenticateAsync_StoreThrowsException_ReturnsFail()
    {
        // Arrange
        var sessionId = "valid-session";
        _context.Request.Headers["Authorization"] = sessionId;
        _sessionStoreMock
            .Setup(x => x.GetSessionAsync(sessionId, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Redis error"));

        // Act
        var result = await RunHandlerAsync();

        // Assert
        Assert.False(result.Succeeded);
        Assert.Equal("Authentication error", result.Failure?.Message);
    }
}
