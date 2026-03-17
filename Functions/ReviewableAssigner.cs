using System;
using System.Collections.Generic;
using Functions.Database;
using Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Functions;

public class ReviewableAssigner(ILogger<ReviewableAssigner> logger, ICosmos cosmos)
{
    [Function("ReviewableAssigner")]
    public async Task Run([CosmosDBTrigger(
            databaseName: "blind-review",
            containerName: "reviewables",
            Connection = "CosmosConnection",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)]
        IReadOnlyList<Reviewable> input)
    {
        logger.LogInformation("{nameof} cosmos triggered", nameof(ReviewableAssigner));
        var users = await cosmos.QueryItemFixed<Models.User>("blind-review", "users", q => q.OrderBy(u => u.activeReviews).Take(2));
        foreach (var reviewable in input)
        {
            if (reviewable.reviewedByUsers.Count == 2) continue;

            reviewable.reviewedByUsers = users.value;
            var upsertItem = await cosmos.UpsertItem("blind-review", "reviewables",reviewable);
            if (!upsertItem.isSuccess) logger.LogError(upsertItem.error, "Failed to add users to reviewable");
        }
    }
}