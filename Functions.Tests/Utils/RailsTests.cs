using Xunit;
using Functions.Utils;
using FluentAssertions;

namespace Functions.Tests.Utils;

public class ResultTests
{
    [Fact]
    public void Ok_CreatesSuccessResult()
    {
        var result = Result<int>.Ok(42);

        result.isSuccess.Should().BeTrue();
        result.value.Should().Be(42);
        result.error.Should().BeNull();
    }

    [Fact]
    public void Fail_WithException_CreatesFailureResult()
    {
        var ex = new InvalidOperationException("something broke");
        var result = Result<int>.Fail(ex);

        result.isSuccess.Should().BeFalse();
        result.error.Should().BeSameAs(ex);
    }

    [Fact]
    public void Fail_WithString_CreatesFailureWithExceptionMessage()
    {
        var result = Result<string>.Fail("bad input");

        result.isSuccess.Should().BeFalse();
        result.error.Message.Should().Be("bad input");
    }

    [Fact]
    public void Then_OnSuccess_ExecutesNext()
    {
        var result = Result<int>.Ok(10)
            .Then(v => Result<string>.Ok($"value={v}"));

        result.isSuccess.Should().BeTrue();
        result.value.Should().Be("value=10");
    }

    [Fact]
    public void Then_OnFailure_PropagatesError()
    {
        var error = new Exception("original error");
        var result = Result<int>.Fail(error)
            .Then(v => Result<string>.Ok($"value={v}"));

        result.isSuccess.Should().BeFalse();
        result.error.Should().BeSameAs(error);
    }

    [Fact]
    public async Task ThenAsync_OnSuccess_ExecutesNextAsync()
    {
        var result = await Result<int>.Ok(5)
            .ThenAsync(v => Task.FromResult(Result<string>.Ok($"async={v}")));

        result.isSuccess.Should().BeTrue();
        result.value.Should().Be("async=5");
    }

    [Fact]
    public async Task ThenAsync_OnFailure_PropagatesError()
    {
        var error = new Exception("async failure");
        var result = await Result<int>.Fail(error)
            .ThenAsync(v => Task.FromResult(Result<string>.Ok($"async={v}")));

        result.isSuccess.Should().BeFalse();
        result.error.Should().BeSameAs(error);
    }
}

public class ResultExtensionsTests
{
    [Fact]
    public async Task Then_TaskExtension_OnSuccess_Chains()
    {
        var taskResult = Task.FromResult(Result<int>.Ok(100));

        var result = await taskResult.Then(v => Result<string>.Ok($"chained={v}"));

        result.isSuccess.Should().BeTrue();
        result.value.Should().Be("chained=100");
    }

    [Fact]
    public async Task Then_TaskExtension_OnFailure_PropagatesError()
    {
        var error = new Exception("task fail");
        var taskResult = Task.FromResult(Result<int>.Fail(error));

        var result = await taskResult.Then(v => Result<string>.Ok($"chained={v}"));

        result.isSuccess.Should().BeFalse();
        result.error.Should().BeSameAs(error);
    }

    [Fact]
    public async Task ThenAsync_TaskExtension_OnSuccess_Chains()
    {
        var taskResult = Task.FromResult(Result<int>.Ok(200));

        var result = await taskResult.ThenAsync(
            v => Task.FromResult(Result<string>.Ok($"async-chained={v}")));

        result.isSuccess.Should().BeTrue();
        result.value.Should().Be("async-chained=200");
    }

    [Fact]
    public async Task ThenAsync_TaskExtension_OnFailure_PropagatesError()
    {
        var error = new Exception("async task fail");
        var taskResult = Task.FromResult(Result<int>.Fail(error));

        var result = await taskResult.ThenAsync(
            v => Task.FromResult(Result<string>.Ok($"async-chained={v}")));

        result.isSuccess.Should().BeFalse();
        result.error.Should().BeSameAs(error);
    }
}
