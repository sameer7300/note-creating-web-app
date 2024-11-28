from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import userSerializers, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note


# Create your views here.

class createUserview(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = userSerializers
    permission_classes = [AllowAny]

class NoteListCreate(generics.ListCreateAPIView): 
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)