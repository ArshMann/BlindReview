using Xunit;
using Functions.Models;
using Functions.Services.Assignments;
using Functions.Utils;
using FluentAssertions;
using Moq;

namespace Functions.Tests.Services;

public class AssignmentServiceTests
{
    [Fact]
    public async Task CreateAssignmentsForReviewable_UsesMatchingStrategy()
    {
        var reviewable = new Reviewable { id = "r1", type = "Expert" };
        var ownerUserId = "owner-1";

        var mockStrategy = new Mock<IAssignmentStrategy>();
        mockStrategy.Setup(s => s.CanHandle(reviewable)).Returns(true);
        mockStrategy.Setup(s => s.SelectReviewersAsync(reviewable, ownerUserId))
            .ReturnsAsync(Result<IReadOnlyList<string>>.Ok(new List<string> { "reviewer-1" }));

        var service = new AssignmentService(new[] { mockStrategy.Object });

        var result = await service.CreateAssignmentsForReviewable(reviewable, ownerUserId);

        result.isSuccess.Should().BeTrue();
        result.value.Should().HaveCount(1);
        result.value[0].reviewerUserId.Should().Be("reviewer-1");
        result.value[0].status.Should().Be("pending");
    }

    [Fact]
    public async Task CreateAssignmentsForReviewable_Fails_WhenNoStrategyMatches()
    {
        var reviewable = new Reviewable { id = "r2", type = "Unknown" };

        var mockStrategy = new Mock<IAssignmentStrategy>();
        mockStrategy.Setup(s => s.CanHandle(reviewable)).Returns(false);

        var service = new AssignmentService(new[] { mockStrategy.Object });

        var result = await service.CreateAssignmentsForReviewable(reviewable, "owner-1");

        result.isSuccess.Should().BeFalse();
        result.error.Message.Should().Contain("Unsupported");
    }

    [Fact]
    public async Task CreateAssignmentsForReviewable_ReturnsEmptyList_WhenNoReviewersFound()
    {
        var reviewable = new Reviewable { id = "r3", type = "Document" };

        var mockStrategy = new Mock<IAssignmentStrategy>();
        mockStrategy.Setup(s => s.CanHandle(reviewable)).Returns(true);
        mockStrategy.Setup(s => s.SelectReviewersAsync(reviewable, "owner-1"))
            .ReturnsAsync(Result<IReadOnlyList<string>>.Ok(new List<string>()));

        var service = new AssignmentService(new[] { mockStrategy.Object });

        var result = await service.CreateAssignmentsForReviewable(reviewable, "owner-1");

        result.isSuccess.Should().BeTrue();
        result.value.Should().BeEmpty();
    }

    [Fact]
    public async Task CreateAssignmentsForReviewable_PropagatesStrategyError()
    {
        var reviewable = new Reviewable { id = "r4", type = "Document" };

        var mockStrategy = new Mock<IAssignmentStrategy>();
        mockStrategy.Setup(s => s.CanHandle(reviewable)).Returns(true);
        mockStrategy.Setup(s => s.SelectReviewersAsync(reviewable, "owner-1"))
            .ReturnsAsync(Result<IReadOnlyList<string>>.Fail("DB connection failed"));

        var service = new AssignmentService(new[] { mockStrategy.Object });

        var result = await service.CreateAssignmentsForReviewable(reviewable, "owner-1");

        result.isSuccess.Should().BeFalse();
        result.error.Message.Should().Contain("DB connection failed");
    }

    [Fact]
    public async Task CreateAssignmentsForReviewable_UsesFirstMatchingStrategy()
    {
        var reviewable = new Reviewable { id = "r5", type = "Expert" };

        var strategy1 = new Mock<IAssignmentStrategy>();
        strategy1.Setup(s => s.CanHandle(reviewable)).Returns(true);
        strategy1.Setup(s => s.SelectReviewersAsync(reviewable, "owner-1"))
            .ReturnsAsync(Result<IReadOnlyList<string>>.Ok(new List<string> { "first-strategy-reviewer" }));

        var strategy2 = new Mock<IAssignmentStrategy>();
        strategy2.Setup(s => s.CanHandle(reviewable)).Returns(true);
        strategy2.Setup(s => s.SelectReviewersAsync(reviewable, "owner-1"))
            .ReturnsAsync(Result<IReadOnlyList<string>>.Ok(new List<string> { "second-strategy-reviewer" }));

        var service = new AssignmentService(new[] { strategy1.Object, strategy2.Object });

        var result = await service.CreateAssignmentsForReviewable(reviewable, "owner-1");

        result.isSuccess.Should().BeTrue();
        result.value[0].reviewerUserId.Should().Be("first-strategy-reviewer");
        strategy2.Verify(s => s.SelectReviewersAsync(It.IsAny<Reviewable>(), It.IsAny<string>()), Times.Never);
    }
}
