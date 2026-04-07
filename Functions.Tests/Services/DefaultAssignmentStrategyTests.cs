using Xunit;
using Functions.Database;
using Functions.Models;
using Functions.Services.Assignments;
using Functions.Utils;
using FluentAssertions;
using Moq;

namespace Functions.Tests.Services;

public class DefaultAssignmentStrategyTests
{
    [Fact]
    public void CanHandle_AlwaysReturnsTrue()
    {
        var cosmos = new Mock<ICosmos>();
        var strategy = new DefaultAssignmentStrategy(cosmos.Object);

        strategy.CanHandle(new Reviewable { type = "anything" }).Should().BeTrue();
        strategy.CanHandle(new Reviewable { type = null }).Should().BeTrue();
    }

    [Fact]
    public async Task SelectReviewersAsync_ReturnsAtMostOneReviewer()
    {
        var cosmos = new Mock<ICosmos>();
        var users = new List<User>
        {
            new() { id = "u1", role = "Student" },
            new() { id = "u2", role = "Student" },
            new() { id = "u3", role = "Reviewer" }
        };

        cosmos.Setup(c => c.QueryItemFixed<User>(
                "blind-review", "users",
                It.IsAny<Func<IQueryable<User>, IQueryable<User>>>(),
                null, null))
            .ReturnsAsync(Result<List<User>>.Ok(users));

        var strategy = new DefaultAssignmentStrategy(cosmos.Object);
        var result = await strategy.SelectReviewersAsync(new Reviewable { id = "r1" }, "owner-1");

        result.isSuccess.Should().BeTrue();
        result.value.Should().HaveCountLessOrEqualTo(1);
    }

    [Fact]
    public async Task SelectReviewersAsync_ReturnsEmpty_WhenNoUsersAvailable()
    {
        var cosmos = new Mock<ICosmos>();
        cosmos.Setup(c => c.QueryItemFixed<User>(
                "blind-review", "users",
                It.IsAny<Func<IQueryable<User>, IQueryable<User>>>(),
                null, null))
            .ReturnsAsync(Result<List<User>>.Ok(new List<User>()));

        var strategy = new DefaultAssignmentStrategy(cosmos.Object);
        var result = await strategy.SelectReviewersAsync(new Reviewable { id = "r1" }, "owner-1");

        result.isSuccess.Should().BeTrue();
        result.value.Should().BeEmpty();
    }

    [Fact]
    public async Task SelectReviewersAsync_ReturnsFailure_WhenCosmosQueryFails()
    {
        var cosmos = new Mock<ICosmos>();
        cosmos.Setup(c => c.QueryItemFixed<User>(
                It.IsAny<string>(), It.IsAny<string>(),
                It.IsAny<Func<IQueryable<User>, IQueryable<User>>>(),
                null, null))
            .ReturnsAsync(Result<List<User>>.Fail("DB down"));

        var strategy = new DefaultAssignmentStrategy(cosmos.Object);
        var result = await strategy.SelectReviewersAsync(new Reviewable { id = "r1" }, "owner-1");

        result.isSuccess.Should().BeFalse();
    }
}
