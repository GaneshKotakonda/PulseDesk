FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY api.csproj ./
RUN dotnet restore api.csproj

COPY . ./
RUN dotnet publish api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}

ENTRYPOINT ["dotnet", "api.dll"]