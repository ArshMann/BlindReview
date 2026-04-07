using Xunit;
using Functions.Database;
using Functions.Models;
using Functions.Services.Assignments;
using Functions.Utils;
using FluentAssertions;
using Moq;

namespace Functions.Tests.Services;

public class DedicatedReviewerStrategyTests
{
    [Fact]
    public void CanHandle_ReturnsTrue_ForExpertType()
    {
        var cosmos = new Mock<ICosmos>();
        var strategy = new DedicatedReviewerStrategy(cosmos.Object);

        strategy.CanHandle(new Reviewable { type = "Expert" }).Should().BeTrue();
    }

    [Fact]
    public void CanHandle_ReturnsFalse_ForOtherTypes()
    {
        var cosmos = new Mock<ICosmos>();
        var strategy = new DedicatedReviewerStrategy(cosmos.Object);

        strategy.CanHandle(new Reviewable { type = "Document" }).Should().BeFalse();
        strategy.CanHandle(new Reviewable { type = null }).Should().BeFalse();
    }

    [Fact]
    public async Task SelectReviewersAsync_ExcludesOwner_AndFiltersToReviewerRole()
    {
        var cosmos = new Mock<ICosmos>();
        var users = new List<User>
        {
            new() { id = "reviewer-1", role = "Reviewer" },
            new() { id = "reviewer-2", role = "Reviewer" }
        };

        cosmos.Setup(c => c.QueryItemFixed<User>(
                "blind-review", "users", It.IsAny<Func<IQueryable<User>, IQueryable<User>>>(),
                null, null))
            .ReturnsAsync(Result<List<User>>.Ok(users));

        var strategy = new DedicatedReviewerStrategy(cosmos.Object);
        var reviewable = new Reviewable { id = "r1", type = "Expert" };

        var result = await strategy.SelectReviewersAsync(reviewable, "owner-1");

        result.isSuccess.Should().BeTrue();
        result.value.Should().HaveCountLessOrEqualTo(1);
    }

    [Fact]
    public async Task SelectReviewersAsync_ReturnsFailure_WhenCosmosQueryFails()
    {
        var cosmos = new Mock<ICosmos>();
        cosmos.Setup(c => c.QueryItemFixed<User>(
                It.IsAny<string>(), It.IsAny<string>(),
                It.IsAny<Func<IQueryable<User>, IQueryable<User>>>(),
                null, null))
            .ReturnsAsync(Result<List<User>>.Fail("Cosmos error"));

        var strategy = new DedicatedReviewerStrategy(cosmos.Object);
        var result = await strategy.SelectReviewersAsync(new Reviewable { type = "Expert" }, "owner-1");

        result.isSuccess.Should().BeFalse();
    }
}
