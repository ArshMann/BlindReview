namespace Functions.Utils;

// From Copliot
public class Result<T>
{
    public bool isSuccess { get; }
    public T value { get; }
    public Exception error { get; }

    public Result(bool success, T value, Exception error)
    {
        isSuccess = success;
        this.value = value;
        this.error = error;
    }
    public static Result<T> Ok(T value) => new(true, value, null!);
    public static Result<T> Fail(Exception error) => new(false, default!, error);
    public static Result<T> Fail(string message) => new(false, default!, new Exception(message));

    public async Task<Result<TNext>> ThenAsync<TNext>(Func<T, Task<Result<TNext>>> next)
    {
        return isSuccess ? await next(value) : Result<TNext>.Fail(error);
    }

    public Result<TNext> Then<TNext>(Func<T, Result<TNext>> next)
    {
        return isSuccess ? next(value) : Result<TNext>.Fail(error);
    }
}

public static class ResultExtensions
{
    public static async Task<Result<TNext>> Then<T, TNext>(
        this Task<Result<T>> resultTask, 
        Func<T, Result<TNext>> next)
    {
        var result = await resultTask;
        return result.isSuccess ? next(result.value) : Result<TNext>.Fail(result.error);
    }
    
    public static async Task<Result<TNext>> ThenAsync<T, TNext>(
        this Task<Result<T>> resultTask,
        Func<T, Task<Result<TNext>>> next)
    {
        var result = await resultTask;
        return result.isSuccess ? await next(result.value) : Result<TNext>.Fail(result.error);
    }
}
