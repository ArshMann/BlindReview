using Functions.Models;
using Functions.Utils;

namespace Functions.Services.Assignments;

public interface IAssignmentService
{
    Task<Result<List<ReviewableAssignment>>> CreateAssignmentsForReviewable(
        Reviewable reviewable,
        string ownerUserId);
}