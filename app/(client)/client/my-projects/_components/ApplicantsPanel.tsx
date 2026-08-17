"use client";

import Link from "next/link";
import { useState } from "react";
import { X, Check } from "lucide-react";
import AvatarImage from "@/components/AvatarImage";
import {
  listProjectApplications,
  reviewApplication,
  type ClientProject,
  type ProjectApplicationEntry,
} from "@/lib/api/clients";
import { friendlyErrorMessage } from "@/lib/api/http";
import { useApiResource } from "@/lib/api/useApiResource";
import { fallbackAvatar } from "@/lib/constants/avatars";
import { RotateCw } from "lucide-react";

export default function ApplicantsPanel({
  project,
  onAssigned,
}: {
  project: ClientProject;
  onAssigned: () => void;
}) {
  const {
    data: applications,
    loading,
    error,
    reload,
  } = useApiResource(() => listProjectApplications(project.id), [project.id], { pollMs: 20000 });
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [reviewError, setReviewError] = useState("");

  async function handleReview(application: ProjectApplicationEntry, status: "ACCEPTED" | "REJECTED") {
    setReviewError("");
    setReviewingId(application.id);
    try {
      // This one call is the complete, documented way to accept/reject an
      // applicant (PATCH /clients/projects/{id}/applications/{applicationId})
      // — the backend owns the resulting project-state transition (setting
      // selectedEngineerId, closing it to other engineers, and presumably
      // reopening it on a reversal) as a side effect of this endpoint.
      //
      // This used to also PATCH the project directly afterward with
      // status/visibility/selectedEngineerId:null to try to force that
      // transition from here — but per the live OpenAPI contract
      // (ProjectUpdate schema), status and visibility aren't accepted fields
      // on that endpoint at all, and selectedEngineerId is a non-nullable
      // integer there, so `null` was never a valid value either. That call
      // was silently failing (or being stripped) the whole time.
      await reviewApplication(project.id, application.id, status);
      reload();
      onAssigned();
    } catch (err) {
      setReviewError(friendlyErrorMessage(err, "Couldn't update this applicant. Please try again."));
    } finally {
      setReviewingId(null);
    }
  }

  if (loading) return <p className="text-sm text-gray-500 p-4">Loading applicants…</p>;
  if (error) {
    return (
      <div className="p-4 text-sm text-red-700 bg-red-50 border-t-2 border-red-400 flex items-center justify-between gap-4">
        <span>Couldn&apos;t load applicants: {error}</span>
        <button
          type="button"
          onClick={reload}
          className="flex items-center gap-1.5 shrink-0 border-2 border-black bg-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-gray-100"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const list = applications ?? [];
  if (list.length === 0) {
    return <p className="text-sm text-gray-500 p-4 border-t-2 border-black">No applicants yet.</p>;
  }

  return (
    <div className="border-t-2 border-black">
      {reviewError && (
        <p className="p-3 text-sm font-medium text-red-700 bg-red-50 border-b-2 border-red-400">{reviewError}</p>
      )}
      <div className="divide-y-2 divide-black">
      {list.map((application) => {
        const isAccepted = application.status === "ACCEPTED";
        // Tags the link with where it came from so the profile page's "Back"
        // control can return straight to this project instead of a generic
        // history pop.
        const profileHref = application.engineerProfileId
          ? `/client/marketplace/${application.engineerProfileId}?from=project&projectId=${project.id}`
          : null;

        const identity = (
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative w-10 h-10 border-2 border-black overflow-hidden shrink-0 bg-gray-100">
              <AvatarImage
                src={application.engineer?.avatarUrl}
                fallbackSrc={fallbackAvatar(application.engineerProfileId, application.engineer?.name)}
                alt={application.engineer?.name ?? "Engineer"}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">
                {application.engineer?.name ?? `Engineer #${application.engineerProfileId}`}
              </p>
              <p className="text-xs text-gray-500">
                {application.engineer?.specialization ?? "—"}
                {application.proposedPrice != null ? ` · $${application.proposedPrice}` : ""}
                {application.message ? ` · "${application.message}"` : ""}
              </p>
            </div>
          </div>
        );

        return (
          <div key={application.id} className="flex items-center gap-4 p-4">
            {/* Accepted applicants are the engineers actually working the
                project, so their identity links straight to their full
                profile instead of just being a label. */}
            {isAccepted && profileHref ? (
              <Link href={profileHref} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                {identity}
              </Link>
            ) : (
              identity
            )}
            {application.status === "PENDING" ? (
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  disabled={reviewingId === application.id}
                  onClick={() => handleReview(application, "REJECTED")}
                  aria-label="Reject applicant"
                  className="w-8 h-8 border-2 border-black bg-red-100 hover:bg-red-200 flex items-center justify-center disabled:opacity-60"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
                <button
                  type="button"
                  disabled={reviewingId === application.id}
                  onClick={() => handleReview(application, "ACCEPTED")}
                  aria-label="Accept applicant"
                  className="w-8 h-8 border-2 border-black bg-[#fef08a] hover:bg-[#f5e35a] flex items-center justify-center disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : isAccepted ? (
              <div className="flex items-center gap-2 shrink-0">
                {profileHref && (
                  <Link
                    href={profileHref}
                    className="text-[10px] font-bold uppercase border-2 border-black px-2 py-1 bg-[#86efac] hover:bg-[#6fdb95] transition-colors"
                  >
                    {application.status}
                  </Link>
                )}
                <button
                  type="button"
                  disabled={reviewingId === application.id}
                  onClick={() => handleReview(application, "REJECTED")}
                  className="text-[10px] font-bold uppercase border-2 border-black px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 transition-colors disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            ) : (
              <span className="text-[10px] font-bold uppercase border-2 border-black px-2 py-1 shrink-0">
                {application.status}
              </span>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}
