using Functions.Models;
using Functions.Utils;

namespace Functions.AssignmentsService;

public interface IAssignmentService
{
    Task<Result<List<Assignment>>> CreateAssignmentsForReviewable(
        Reviewable reviewable,
        string ownerUserId);
}