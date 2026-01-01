namespace PublicApi.IntegrationTests.Unit;

public class VisitFollowsTemplateTest
{
    private readonly Domain.Entities.Visits.VisitTemplate _template;

    public VisitFollowsTemplateTest()
    {
        _template = new()
        {
            Titles =
            [
                ["Title1"],
                ["Title2", "Subtitle2"],
            ],
        };
    }

    [Fact]
    public void VisitFollowsTemplate_InvalidLength_ReturnsFalse()
    {
        // Arrange
        var visit = new Domain.Entities.Visits.Visit { Fields = new() { ["0-0-"] = "Value1" } };

        // Act
        var result = visit.FollowsTemplate(_template);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void VisitFollowsTemplate_TrailingChars_ReturnsFalse()
    {
        // Arrange
        var visit = new Domain.Entities.Visits.Visit { Fields = new() { ["0-0gbuf"] = "Value1" } };

        // Act
        var result = visit.FollowsTemplate(_template);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void VisitFollowsTemplate_InvalidParsingCol_ReturnsFalse()
    {
        // Arrange
        var visit = new Domain.Entities.Visits.Visit { Fields = new() { ["0-gbuf"] = "Value1" } };

        // Act
        var result = visit.FollowsTemplate(_template);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void VisitFollowsTemplate_InvalidParsingRow_ReturnsFalse()
    {
        // Arrange
        var visit = new Domain.Entities.Visits.Visit { Fields = new() { ["qwy-0"] = "Value1" } };

        // Act
        var result = visit.FollowsTemplate(_template);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void VisitFollowsTemplate_DataForTitleWhenSubtitles_ReturnsFalse()
    {
        // Arrange
        var visit = new Domain.Entities.Visits.Visit { Fields = new() { ["1-0"] = "Value1" } };

        // Act
        var result = visit.FollowsTemplate(_template);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void VisitFollowsTemplate_OutOfRangeIndex_ReturnsFalse()
    {
        // Arrange
        var visit = new Domain.Entities.Visits.Visit { Fields = new() { ["100-0"] = "Value1" } };

        // Act
        var result = visit.FollowsTemplate(_template);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void VisitFollowsTemplate_ValidPath_ReturnsTrue()
    {
        // Arrange
        var visit = new Domain.Entities.Visits.Visit { Fields = new() { ["0-0"] = "Value1" } };

        // Act
        var result = visit.FollowsTemplate(_template);

        // Assert
        Assert.True(result);
    }
}
