from rest_framework.permissions import BasePermission


class IsAuthenticatedOrAdminUser(BasePermission):
    """
    Custom permission to allow access if the user is either authenticated or an admin user.
    """

    def has_permission(self, request, view):
        return bool(request.user and (request.user.is_authenticated or request.user.is_staff))
