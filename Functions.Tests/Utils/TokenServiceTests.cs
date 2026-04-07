using Xunit;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Functions.Utils;
using Functions.Models;
using FluentAssertions;

namespace Functions.Tests.Utils;

public class TokenServiceTests
{
    private readonly TokenService _tokenService = new();

    [Fact]
    public void CreateToken_ReturnsValidJwtString()
    {
        var user = new User
        {
            id = "user-123",
            email = "test@example.com",
            role = "Student",
            credits = 5
        };

        var token = _tokenService.CreateToken(user);

        token.Should().NotBeNullOrEmpty();
        var handler = new JwtSecurityTokenHandler();
        handler.CanReadToken(token).Should().BeTrue();
    }

    [Fact]
    public void CreateToken_ContainsExpectedClaims()
    {
        var user = new User
        {
            id = "user-456",
            email = "reviewer@example.com",
            role = "Reviewer",
            credits = 10
        };

        var token = _tokenService.CreateToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Sub && c.Value == "user-456");
        jwt.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Email && c.Value == "reviewer@example.com");
        jwt.Claims.Should().Contain(c => c.Type == "role" && c.Value == "Reviewer");
        jwt.Claims.Should().Contain(c => c.Type == "credits" && c.Value == "10");
    }

    [Fact]
    public void CreateToken_SetsExpiryToSevenDays()
    {
        var user = new User { id = "user-1", email = "a@b.com", role = "Student", credits = 0 };

        var token = _tokenService.CreateToken(user);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(token);

        jwt.ValidTo.Should().BeCloseTo(DateTime.UtcNow.AddDays(7), TimeSpan.FromMinutes(5));
    }

    [Fact]
    public void ValidateToken_ReturnsClaimsPrincipal_ForValidToken()
    {
        var user = new User { id = "user-789", email = "valid@test.com", role = "Instructor", credits = 3 };
        var token = _tokenService.CreateToken(user);

        var principal = _tokenService.ValidateToken(token);

        principal.Should().NotBeNull();
        principal!.FindFirst(ClaimTypes.NameIdentifier)?.Value.Should().Be("user-789");
    }

    [Fact]
    public void ValidateToken_ReturnsNull_ForEmptyString()
    {
        var result = _tokenService.ValidateToken("");

        result.Should().BeNull();
    }

    [Fact]
    public void ValidateToken_ReturnsNull_ForNullString()
    {
        var result = _tokenService.ValidateToken(null!);

        result.Should().BeNull();
    }

    [Fact]
    public void ValidateToken_ThrowsForTamperedToken()
    {
        var user = new User { id = "user-1", email = "a@b.com", role = "Student", credits = 0 };
        var token = _tokenService.CreateToken(user);
        var tampered = token + "tampered";

        var act = () => _tokenService.ValidateToken(tampered);

        act.Should().Throw<Exception>();
    }
}
