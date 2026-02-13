import {
  X,
  User,
  Phone,
  MapPin,
  GraduationCap,
  Building2,
  Calendar,
  Heart,
  Users,
} from "lucide-react";

import { StudentResponse } from "../../api/student/types";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: StudentResponse;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBgColor?: string;
}

const InfoCard = ({
  icon,
  label,
  value,
  iconBgColor = "from-blue-500 to-indigo-600",
}: InfoCardProps) => (
  <div className="group relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
    <div className="flex items-start gap-3">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${iconBgColor} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        <div className="text-white">{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 break-words">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default function StudentDetailsModal({
  isOpen,
  onClose,
  student,
}: StudentDetailsModalProps) {
  if (!isOpen || !student) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-indig-900/80 to-purpl-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-r from-indgo-600 via-puple-600 to-pnk-600 p-8 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar with Gradient Ring */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full blur opacity-75 animate-pulse"></div>
                <div className="relative h-24 w-24 bg-gradient-to-br from-white to-indigo-100 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/50">
                  <span className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {getInitials(student.name)}
                  </span>
                </div>
              </div>

              {/* Student Info */}
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
                  {student.name}
                </h2>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {student.class || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {student.dorm || "-"}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${
                      student.isActive
                        ? "bg-green-500/30 text-green-100 ring-2 ring-green-400/50"
                        : "bg-red-500/30 text-red-100 ring-2 ring-red-400/50"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        student.isActive ? "bg-green-300" : "bg-red-300"
                      } animate-pulse`}
                    ></span>
                    {student.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="group p-2.5 border-2 border-black/30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-300 hover:rotate-90 hover:scale-110"
            >
              <X className="h-6 w-6 text-black/30" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(95vh-200px)] bg-gradient-to-br from-gray-50 to-indigo-50/30">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoCard
                icon={<Phone className="h-5 w-5" />}
                label="Phone Number"
                value={student.contact?.phone || "Not provided"}
                iconBgColor="from-blue-500 to-cyan-600"
              />

              <InfoCard
                icon={<Calendar className="h-5 w-5" />}
                label="Date of Birth"
                value={new Date(student.dateOfBirth).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
                iconBgColor="from-purple-500 to-pink-600"
              />

              <InfoCard
                icon={<Calendar className="h-5 w-5" />}
                label="Admission Date"
                value={new Date(student.admissionDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
                iconBgColor="from-indigo-500 to-blue-600"
              />

              {student.bloodGroup && (
                <InfoCard
                  icon={<Heart className="h-5 w-5" />}
                  label="Blood Group"
                  value={student.bloodGroup}
                  iconBgColor="from-red-500 to-pink-600"
                />
              )}

              <InfoCard
                icon={<GraduationCap className="h-5 w-5" />}
                label="Admission Number"
                value={String(student.admissionNumber)}
                iconBgColor="from-emerald-500 to-teal-600"
              />

              <InfoCard
                icon={<Users className="h-5 w-5" />}
                label="Number of Siblings"
                value={String(student.numberOfSiblings ?? 0)}
                iconBgColor="from-orange-500 to-amber-600"
              />
            </div>

            {/* Address Card - Full Width */}
            {student.contact?.address && (
              <div className="group relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {student.contact.address}
                    </p>
                    {(student.contact?.district ||
                      student.contact?.province) && (
                      <p className="text-xs text-gray-600 mt-1">
                        {[student.contact?.district, student.contact?.province]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Family Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-800">
                Family & Guardian Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Guardian Card */}
              {student.guardian?.name && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800">Guardian</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Name</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {student.guardian.name}
                      </p>
                    </div>
                    {student.guardian.phoneNumber && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Phone</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {student.guardian.phoneNumber}
                        </p>
                      </div>
                    )}
                    {student.guardian.occupation && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Occupation</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {student.guardian.occupation}
                        </p>
                      </div>
                    )}
                    {student.guardian.address && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Address</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {student.guardian.address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Parents Cards */}
              <div className="space-y-4">
                {(student.father?.name || student.father?.mobile) && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800">Father</h4>
                    </div>
                    <div className="space-y-2">
                      {student.father.name && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Name</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {student.father.name}
                          </p>
                        </div>
                      )}
                      {student.father.mobile && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Mobile</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {student.father.mobile}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(student.mother?.name || student.mother?.mobile) && (
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 border border-pink-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800">Mother</h4>
                    </div>
                    <div className="space-y-2">
                      {student.mother.name && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Name</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {student.mother.name}
                          </p>
                        </div>
                      )}
                      {student.mother.mobile && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Mobile</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {student.mother.mobile}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 bg-gradient-to-r from-gray-50 to-indigo-50/50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="group px-6 py-3 bg-gradint-to-r from-inigo-600 to-purle-600 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hoer:scale-105 transition-all duration-300 flex items-center gap-2 hover:bg-blue-700"
          >
            <span>Close</span>
            <X className="h-4 w-4 group-hover:rotte-90 transition-tranform duration-300" />
          </button>
        </div>
      </div>

      {/* <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style> */}
    </div>
  );
}
