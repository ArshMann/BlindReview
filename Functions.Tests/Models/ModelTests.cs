using Xunit;
using Functions.Models;
using FluentAssertions;

namespace Functions.Tests.Models;

public class UserModelTests
{
    [Fact]
    public void NewUser_HasDefaultValues()
    {
        var user = new User();

        user.id.Should().NotBeNullOrEmpty();
        user.name.Should().BeEmpty();
        user.email.Should().BeEmpty();
        user.role.Should().Be("Student");
        user.credits.Should().Be(0);
        user.createdAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void User_GeneratesUniqueIds()
    {
        var user1 = new User();
        var user2 = new User();

        user1.id.Should().NotBe(user2.id);
    }
}

public class ReviewableModelTests
{
    [Fact]
    public void Reviewable_DefaultCollections_AreEmpty()
    {
        var reviewable = new Reviewable();

        reviewable.assignments.Should().NotBeNull().And.BeEmpty();
        reviewable.comments.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Reviewable_IsRecord_SupportsWithExpression()
    {
        var original = new Reviewable { id = "r1", name = "Test Doc", cost = 2 };
        var updated = original with { name = "Updated Doc" };

        updated.id.Should().Be("r1");
        updated.name.Should().Be("Updated Doc");
        updated.cost.Should().Be(2);
        original.name.Should().Be("Test Doc");
    }
}

public class ReviewableAssignmentModelTests
{
    [Fact]
    public void NewAssignment_HasDefaultValues()
    {
        var assignment = new ReviewableAssignment();

        assignment.reviewerUserId.Should().BeEmpty();
        assignment.status.Should().Be("pending");
        assignment.assignedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
        assignment.deadline.Should().BeNull();
    }
}

public class CommentModelTests
{
    [Fact]
    public void NewComment_HasDefaultValues()
    {
        var comment = new Comment();

        comment.id.Should().NotBeNullOrEmpty();
        comment.reviewerUserId.Should().BeEmpty();
        comment.text.Should().BeEmpty();
        comment.createdAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
        comment.updatedAt.Should().BeNull();
    }
}

public class ErrorModelTests
{
    [Fact]
    public void Error_Code_DerivedFromStatusCode()
    {
        var error = new Error
        {
            statusCode = System.Net.HttpStatusCode.BadRequest,
            message = "Something went wrong"
        };

        error.code.Should().Be("BadRequest");
    }
}
